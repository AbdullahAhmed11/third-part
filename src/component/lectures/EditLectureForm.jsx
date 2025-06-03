import React, { useState, useEffect } from 'react';
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

const EditLectureForm = ({ lecture, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    
    const [formData, setFormData] = useState({
        id: lecture?.id || '',
        title: lecture?.title || '',
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setCoursesLoading(true);
                const response = await axios.get(
                    'https://thirdpartyy.runasp.net/api/Courses/GetCourses?page=1&size=10&universityId=1&isActive=false'
                );
                setCourses(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError(err.message || 'Failed to load courses');
            } finally {
                setCoursesLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

  const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post(
                'https://thirdpartyy.runasp.net/api/Lectures/EditLecture',
                {
                    id: formData.id,
                    title: formData.title
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            onSuccess(response.data);
            onClose();
        } catch (err) {
            console.error('Error updating lecture:', err);
            setError(err.response?.data?.message || 'Failed to update lecture');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DialogTitle>
                <Typography variant="h5" component="div">
                    Edit Lecture
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <Stack spacing={3}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <TextField
                            fullWidth
                            label="Lecture Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                       


                    
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
                            {loading ? 'Updating...' : 'Update Lecture'}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </>
    );
}

export default EditLectureForm;