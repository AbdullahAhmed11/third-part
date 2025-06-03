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
    InputLabel
} from '@mui/material';

const AddDoctorForm = ({ onClose, onSuccess }) => {
    const [universities, setUniversities] = useState([]);
    const [loadingUniversities, setLoadingUniversities] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        description: '',
        universityId: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    const getAllUniversities = async () => {
        try {
            const response = await axios.get(`https://thirdpartyy.runasp.net/api/Universities/GetUniversities`);
            setUniversities(response.data);
            setLoadingUniversities(false);
        } catch (error) {
            setLoadingUniversities(false);
            console.error("Error fetching universities:", error);
        }
    }

    useEffect(() => {
        getAllUniversities();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
        setError(null);

        try {
            const formDataToSend = new FormData();
            
            // Append all form fields
            formDataToSend.append('Name', formData.name);
            formDataToSend.append('Email', formData.email);
            formDataToSend.append('Phone', formData.phone);
            formDataToSend.append('Password', formData.password);
            formDataToSend.append('Description', formData.description);
            formDataToSend.append('UniversityId', formData.universityId);
            
            // Append image if exists
            if (imageFile) {
                formDataToSend.append('Image', imageFile);
            }

            const response = await axios.post(
                'https://thirdpartyy.runasp.net/api/Doctors/AddDoctor',
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
            console.error("Error adding doctor:", error);
            setError(error.response?.data?.message || 'Failed to add doctor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DialogTitle>
                <Typography variant="h5" component="div">
                    Add New Doctor
                </Typography>
            </DialogTitle>
            
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <Stack spacing={3}>
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

                        <TextField
                            fullWidth
                            label="Doctor Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />

                        <FormControl fullWidth required>
                            <InputLabel id="university-select-label">University</InputLabel>
                            <Select
                                labelId="university-select-label"
                                id="university-select"
                                name="universityId"
                                value={formData.universityId}
                                label="University"
                                onChange={handleChange}
                                disabled={loadingUniversities}
                            >
                                {loadingUniversities ? (
                                    <MenuItem disabled>
                                        <CircularProgress size={24} />
                                    </MenuItem>
                                ) : (
                                    universities.map((uni) => (
                                        <MenuItem key={uni.id} value={uni.id}>
                                            {uni.name}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>

                        {error && (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        )}
                    </Stack>
    
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
                            {loading ? 'Adding...' : 'Add Doctor'}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </>
    );
}

export default AddDoctorForm;