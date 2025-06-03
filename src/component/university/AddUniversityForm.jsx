import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
    Box,
    Button,
    TextField,
    Typography,
    Stack,
    CircularProgress,
    DialogTitle,
    DialogContent
} from '@mui/material';

const AddUniversityForm = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        
        // Validate file size (50MB limit)
        if (file && file.size > 50 * 1024 * 1024) {
            setError('File size exceeds 50MB limit');
            return;
        }

        setImageFile(file);
        setError(null);

        // Create preview
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

        if (!imageFile) {
            setError('Please upload an image');
            setLoading(false);
            return;
        }

        if (!formData.name) {
            setError('University name is required');
            setLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('Image', imageFile);
            formDataToSend.append('Name', formData.name);

            const response = await axios.post(
                'https://thirdpartyy.runasp.net/api/Universities/AddUniversity',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                onSuccess?.(); // Call success callback if provided
                onClose(); // Close the form
            } else {
                throw new Error('Failed to add university');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to add university');
            console.error('Error adding university:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DialogTitle>
                <Typography variant="h5" component="div">
                    Add New University
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
                        <TextField
                            fullWidth
                            label="University Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        
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
                            {loading ? 'Adding...' : 'Add'}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </>
    );
};

export default AddUniversityForm;