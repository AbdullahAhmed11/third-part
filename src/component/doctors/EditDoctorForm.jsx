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
    Alert
} from '@mui/material';
const EditDoctorForm = ({ doctor, onClose, onSuccess }) => {
      const [formData, setFormData] = useState({
          name: doctor?.doctorName || '',
      });
      const [imageFile, setImageFile] = useState(null);
      const [previewImage, setPreviewImage] = useState(doctor?.imagePath || null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const [success, setSuccess] = useState(null);
      const fileInputRef = useRef(null);


          useEffect(() => {
              if (doctor) {
                  setFormData({
                      name: doctor.doctorName || '',
                  });
                  setPreviewImage(doctor.imagePath || null);
              }
          }, [doctor]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value.trimStart()
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        
        if (!file) {
            setError(null);
            setImageFile(null);
            return;
        }

        // Validate file type
        if (!file.type.match('image.*')) {
            setError('Please upload an image file (JPEG, PNG, etc.)');
            return;
        }

        // Validate file size (50MB limit)
        if (file.size > 50 * 1024 * 1024) {
            setError('File size exceeds 50MB limit');
            return;
        }

        setImageFile(file);
        setError(null);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

  return (
    <>
            <DialogTitle>
                    <Typography variant="h5" component="div">
                        Edit Doctor
                    </Typography>
                </DialogTitle>
                
                <DialogContent>
                    <Box component="form"  sx={{ mt: 2 }}>
                        <Stack spacing={3}>
                            {error && (
                                <Alert severity="error" onClose={() => setError(null)}>
                                    {error}
                                </Alert>
                            )}
                            {success && (
                                <Alert severity="success">
                                    {success}
                                </Alert>
                            )}
    
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography variant="body1" fontWeight="bold">
                                    Image <span style={{ color: '#F54135', fontWeight: 'normal' }}>*Max 50 MB*</span>
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
                                            alt="University" 
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'cover' 
                                            }} 
                                        />
                                    ) : (
                                        <>
                                            <Typography variant="caption" fontWeight="bold">
                                                Change
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
                                error={Boolean(error && !formData.name.trim())}
                                helperText={error && !formData.name.trim() ? 'This field is required' : ''}
                            />
                        </Stack>
    
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 4, mb: 2 }}>
                            <Button 
                                onClick={onClose}
                                variant="outlined"
                                sx={{
                                    background: '#F54135',
                                    color: '#fff',
                                    borderColor: '#EFA61B',
                                    '&:hover': {
                                        backgroundColor: '#D32F2F'
                                    },
                                    minWidth: 120
                                }}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                sx={{
                                    background: '#1A843C',
                                    color: '#fff',
                                    borderColor: '#EFA61B',
                                    '&:hover': {
                                        backgroundColor: '#2E7D32'
                                    },
                                    minWidth: 120
                                }}
                            >
                                {loading ? 'Updating...' : 'Update'}
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
    </>
  )
}

export default EditDoctorForm