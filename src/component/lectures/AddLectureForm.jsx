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

const AddLectureForm = ({ onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        courseId: '',
        isActive: true,
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setCoursesLoading(true);
                const response = await axios.get(
                    'https://thirdpartyy.runasp.net/api/Courses/GetCourses?page=1&size=10&universityId=1&isActive=false'
                );
                const coursesData = Array.isArray(response.data) ? response.data : [];
                setCourses(coursesData);
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
            [name]: name === "isActive" ? value === "true" : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const lectureData = {
                title: formData.title,
                courseId: formData.courseId,
                isActive: formData.isActive,
            };

            const response = await axios.post(
                'https://thirdpartyy.runasp.net/api/Lectures/AddLecture',
                lectureData
            );

            onSuccess(response.data);
            onClose();
        } catch (err) {
            console.error('Error adding lecture:', err);
            setError(err.response?.data?.message || 'Failed to add lecture');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DialogTitle>
                <Typography variant="h5" component="div">
                    Add New Lecture
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Lecture Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                        <FormControl fullWidth>
                            <InputLabel id="course-select-label">Course</InputLabel>
                            <Select
                                labelId="course-select-label"
                                id="course-select"
                                name="courseId"
                                value={formData.courseId}
                                label="Course"
                                onChange={handleChange}
                                disabled={coursesLoading}
                                required
                            >
                                {coursesLoading ? (
                                    <MenuItem disabled>
                                        <CircularProgress size={24} />
                                        Loading courses...
                                    </MenuItem>
                                ) : courses.length > 0 ? (
                                    courses.map((course) => (
                                        <MenuItem key={course.id} value={course.id}>
                                            {course.name || `Course ${course.id}`}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No courses available</MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="is-active-label">Active Status</InputLabel>
                            <Select
                                labelId="is-active-label"
                                name="isActive"
                                value={formData.isActive.toString()}
                                label="Active Status"
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="true">Active</MenuItem>
                                <MenuItem value="false">Inactive</MenuItem>
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
                            {loading ? 'Adding...' : 'Add Lecture'}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </>
    );
};

export default AddLectureForm;
