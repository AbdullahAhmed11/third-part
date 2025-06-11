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
    FormControlLabel,
    Switch
} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useParams } from "react-router-dom";

const AddCourseLectureForm = ({ onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [fetchingCourses, setFetchingCourses] = useState(false);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
     const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        courseId: '',
        isActive: true
    });
    
    const getAllCourses = async () => {
        try {
            setFetchingCourses(true);
            const response = await axios.get(`https://thirdpartyy.runasp.net/api/Courses/GetCourses?page=1&size=10`);
            setCourses(response.data);
            setFetchingCourses(false);
        } catch (error) {
            setError('Failed to fetch courses');
            setFetchingCourses(false);
            console.error("Error fetching courses:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleToggleActive = (e) => {
        setFormData(prev => ({
            ...prev,
            isActive: e.target.checked
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                title: formData.title,
                courseId: id,
                isActive: formData.isActive
            };

            const response = await axios.post(
                'https://thirdpartyy.runasp.net/api/Lectures/AddLecture',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Lecture added successfully:', response.data);
            onSuccess(); // Call the success callback if provided
            onClose(); // Close the dialog
        } catch (error) {
            console.error('Error adding lecture:', error);
            setError(error.response?.data?.message || 'Failed to add lecture');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllCourses();
    }, []);

    return (
        <>
            <DialogTitle>
                <Typography variant="h5" component="div">
                    Add New Chapter/Lecture
                </Typography>
            </DialogTitle>
 
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <Stack spacing={3}>
                        {/* Course Selection */}
                        {/* <FormControl fullWidth>
                            <InputLabel id="course-select-label">Select Course</InputLabel>
                            <Select
                                labelId="course-select-label"
                                id="course-select"
                                name="courseId"
                                value={formData.courseId}
                                label="Select Course"
                                onChange={handleChange}
                                disabled={fetchingCourses}
                                required
                            >
                                {fetchingCourses && (
                                    <MenuItem disabled>
                                        <CircularProgress size={24} />
                                    </MenuItem>
                                )}
                                {!fetchingCourses && courses.map((course) => (
                                    <MenuItem key={course.id} value={course.id}>
                                        {course.name || `Course ${course.id}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl> */}

                        {/* Lecture Title */}
                        <TextField
                            fullWidth
                            label="Lecture Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                        {/* Active Status Toggle */}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isActive}
                                    onChange={handleToggleActive}
                                    name="isActive"
                                    color="primary"
                                />
                            }
                            label={formData.isActive ? "Active" : "Inactive"}
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
                            disabled={loading || fetchingCourses}
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                            sx={{
                                background: '#1A843C',
                                color: '#fff',
                                borderColor: '#EFA61B',
                            }}
                        >
                            {loading ? 'Adding...' : 'Add Lecture'}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </>
    );
}

export default AddCourseLectureForm;