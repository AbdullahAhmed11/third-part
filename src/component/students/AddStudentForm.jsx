import React, { useState, useEffect , useRef} from 'react';
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
    Alert
} from '@mui/material';

const AddStudentForm = ({ onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [universities, setUniversities] = useState([]);
    const [universitiesLoading, setUniversitiesLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [imageIdFile, setImageIdFile] = useState(null); // New state for ID image
    const [imageIdPreview, setImageIdPreview] = useState('');
    const fileInputRef = useRef(null);
    const fileIdInputRef = useRef(null); 
    const [formData, setFormData] = useState({
        name: '',
        universityId: '',
        email: '',
        phone: '',
        password: '',
        isActive: true,
    });

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                setUniversitiesLoading(true);
                const response = await axios.get(
                    'https://thirdpartyy.runasp.net/api/Universities/GetUniversities?page=1&size=10'
                );
                const universitiesData = Array.isArray(response.data) ? response.data : [];
                setUniversities(universitiesData);
            } catch (err) {
                console.error('Error fetching universities:', err);
                setError(err.message || 'Failed to load universities');
            } finally {
                setUniversitiesLoading(false);
            }
        };

        fetchUniversities();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleIdImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageIdFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageIdPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };
    const handleIdUploadClick = () => {
        fileIdInputRef.current.click();
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "isActive" ? value === "true" : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Create FormData object
            const formDataToSend = new FormData();
            
            // Append the image file if it exists
            if (imageFile) {
                formDataToSend.append('Image', imageFile);
            }
             if (imageIdFile) {
                formDataToSend.append('ImageId', imageIdFile); // Changed field name to match your API
            }
            // Append all other form fields
            formDataToSend.append('Name', formData.name);
            formDataToSend.append('UniversityId', formData.universityId);
            formDataToSend.append('Email', formData.email);
            formDataToSend.append('Phone', formData.phone);
            formDataToSend.append('Password', formData.password);

            const response = await axios.post(
                'https://thirdpartyy.runasp.net/api/Students/AddStudent',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            onSuccess(response.data);
            onClose();
        } catch (err) {
            console.error('Error adding student:', err);
            setError(err.response?.data?.message || 'Failed to add student');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DialogTitle>
                <Typography variant="h5" component="div">
                    Add New Student
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <Stack spacing={3}>
                        <div className='flex items-center justify-between'>
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
                                                      {imagePreview ? (
                                                          <img 
                                                              src={imagePreview} 
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
                           
                           
                           
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body1" fontWeight="bold">
                                ID Image <span style={{ color: '#F54135', fontWeight: 'normal' }}>*Please upload image less than 50 MB*</span>
                            </Typography>
                            
                            <input
                                type="file"
                                ref={fileIdInputRef}
                                onChange={handleIdImageChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                                required
                            />
                            
                            <Box
                                onClick={handleIdUploadClick}
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
                                {imageIdPreview ? (
                                    <img 
                                        src={imageIdPreview} 
                                        alt="ID Preview" 
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'contain' 
                                        }} 
                                    />
                                ) : (
                                    <>
                                        <Typography variant="caption" fontWeight="bold">
                                            Upload ID Image
                                        </Typography>
                                    </>
                                )}
                            </Box>
                            </Box>

                        </div>

                        <TextField
                            fullWidth
                            label="Full Name"
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
                            label="Phone Number"
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

                        <FormControl fullWidth>
                            <InputLabel id="university-select-label">University</InputLabel>
                            <Select
                                labelId="university-select-label"
                                id="university-select"
                                name="universityId"
                                value={formData.universityId}
                                label="University"
                                onChange={handleChange}
                                disabled={universitiesLoading}
                                required
                            >
                                {universitiesLoading ? (
                                    <MenuItem disabled>
                                        <CircularProgress size={24} />
                                        Loading universities...
                                    </MenuItem>
                                ) : universities.length > 0 ? (
                                    universities.map((university) => (
                                        <MenuItem key={university.id} value={university.id}>
                                            {university.name || `University ${university.id}`}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No universities available</MenuItem>
                                )}
                            </Select>
                        </FormControl>

                     

                        {error && (
                            <Alert severity="error">{error}</Alert>
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
                            {loading ? 'Adding...' : 'Add Student'}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </>
    );
};

export default AddStudentForm;