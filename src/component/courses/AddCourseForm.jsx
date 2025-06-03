import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
    Box,
    Button,
    TextField,
    Typography,
    Stack,
    CircularProgress,
    DialogTitle,
    DialogContent,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel
} from '@mui/material';

const AddCourseForm = ({ onClose, onSuccess }) => {
    const [doctors, setDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        Title: '',
        About: '',
        DoctorId: '',
        IsActive: true,
        IsDownload: false,
        Price: 0
    });

    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    // Fetch doctors on component mount
    const getAlldoctors = async () => {
        try {
            setLoadingDoctors(true);
            const response = await axios.get(`https://thirdpartyy.runasp.net/api/Doctors/GetDoctors?page=1&size=10`);
            setDoctors(response.data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
            setError("Failed to fetch doctors. Please try again later");
        } finally {
            setLoadingDoctors(false);
        }
    }

    useEffect(() => {
        getAlldoctors();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        
        if (file && file.size > 50 * 1024 * 1024) {
            setError('File size exceeds 50MB limit');
            return;
        }

        setImageFile(file);
        setError(null);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('Title', formData.Title);
            formDataToSend.append('About', formData.About);
            formDataToSend.append('DoctorId', formData.DoctorId);
            formDataToSend.append('IsActive', formData.IsActive);
            formDataToSend.append('IsDownload', formData.IsDownload);
            formDataToSend.append('Price', formData.Price);
            
            if (imageFile) {
                formDataToSend.append('Image', imageFile);
            }

            const response = await axios.post(
                'https://thirdpartyy.runasp.net/api/Courses/AddCourse',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            onSuccess(response.data);
            onClose();
        } catch (error) {
            console.error("Error adding course:", error);
            setError(error.response?.data?.message || 'Failed to add course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DialogTitle>
                <Typography variant="h5" component="div">
                    Add New Course
                </Typography>
            </DialogTitle>
            
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <Stack spacing={3}>
                        {/* Image Upload */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body1" fontWeight="bold">
                                Image <span style={{ color: '#F54135', fontWeight: 'normal' }}>*Please upload image less than 50 MB*</span>
                            </Typography>
                            
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                                required
                            />
                            
                            <Box
                                onClick={handleUploadClick}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: '50%',
                                    backgroundColor: '#D9D9D9',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}
                            >
                                {previewImage ? (
                                    <img 
                                        src={previewImage} 
                                        alt="Preview" 
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover' 
                                        }} 
                                    />
                                ) : (
                                    <>
                                        <Typography variant="caption" fontWeight="bold">
                                            Upload
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </Box>

                        {/* Title */}
                        <TextField
                            fullWidth
                            label="Title"
                            name="Title"
                            value={formData.Title}
                            onChange={handleChange}
                            required
                        />

                        {/* About */}
                        <TextField
                            fullWidth
                            label="About"
                            name="About"
                            multiline
                            rows={4}
                            value={formData.About}
                            onChange={handleChange}
                            required
                        />

                        {/* Price */}
                        <TextField
                            fullWidth
                            label="Price"
                            name="Price"
                            type="number"
                            value={formData.Price}
                            onChange={handleChange}
                            required
                            inputProps={{ min: 0 }}
                        />

                        {/* Doctor Selection */}
                        <FormControl fullWidth required>
                            <InputLabel id="doctor-select-label">Doctor</InputLabel>
                            <Select
                                labelId="doctor-select-label"
                                id="doctor-select"
                                name="DoctorId"
                                value={formData.DoctorId}
                                label="Doctor"
                                onChange={handleChange}
                                disabled={loadingDoctors}
                            >
                                {loadingDoctors ? (
                                    <MenuItem disabled>
                                        <CircularProgress size={24} />
                                        Loading doctors...
                                    </MenuItem>
                                ) : (
                                    doctors.map((doctor) => (
                                        <MenuItem key={doctor.id} value={doctor.id}>
                                            {doctor.doctorName}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>

                        {/* IsActive Switch */}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.IsActive}
                                    onChange={handleChange}
                                    name="IsActive"
                                    color="primary"
                                />
                            }
                            label="Active Course"
                        />

                        {/* IsDownload Switch */}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.IsDownload}
                                    onChange={handleChange}
                                    name="IsDownload"
                                    color="primary"
                                />
                            }
                            label="Available for Download"
                        />

                        {error && (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        )}
                    </Stack>
    
                    {/* Form Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 4, mb: 5 }}>
                        <Button 
                            onClick={onClose}
                            variant="outlined"
                            sx={{
                                background: '#F54135',
                                color: '#fff',
                                borderColor: '#EFA61B',
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                            sx={{
                                background: '#1A843C',
                                color: '#fff',
                                borderColor: '#EFA61B',
                            }}
                        >
                            {loading ? 'Adding...' : 'Add Course'}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </>
    )
}

export default AddCourseForm;