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

const AddExamForm = ({ onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [lecturesLoading, setLecturesLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [courses, setCourses] = useState([]);
    const [lectures, setLectures] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        courseId: '',
        lectureId: ''
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

    const fetchLectures = async (courseId) => {
        try {
            setLecturesLoading(true);
            const response = await axios.get(
                `https://thirdpartyy.runasp.net/api/Lectures/GetLectures?courseId=${courseId}`
            );
            const lecturesData = Array.isArray(response.data) ? response.data : [];
            setLectures(lecturesData);
        } catch (err) {
            console.error('Error fetching lectures:', err);
            setError(err.message || 'Failed to load lectures');
        } finally {
            setLecturesLoading(false);
        }
    };

    const handleCourseChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            courseId: value,
            lectureId: '' // Reset lecture selection when course changes
        }));
        
        if (value) {
            fetchLectures(value);
        } else {
            setLectures([]);
        }
    };

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
        setError(null);
        setSuccess(null);

        try {
            // Create FormData object
            const formDataToSend = new FormData();
            formDataToSend.append('Title', formData.title);
            formDataToSend.append('LectureId', formData.lectureId);

            const response = await axios.post(
                'https://thirdpartyy.runasp.net/api/Exams/AddExam',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setSuccess('Exam added successfully!');
            if (onSuccess) onSuccess(response.data);
            
            // Reset form after successful submission
            setFormData({
                title: '',
                courseId: '',
                lectureId: ''
            });
            setLectures([]);
            
        } catch (err) {
            console.error('Error adding exam:', err);
            setError(err.response?.data?.message || err.message || 'Failed to add exam');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DialogTitle>
                <Typography variant="h5" component="div">
                    Add New Exam
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Exam Title"
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
                                onChange={handleCourseChange}
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
                            <InputLabel id="lecture-select-label">Lecture</InputLabel>
                            <Select
                                labelId="lecture-select-label"
                                id="lecture-select"
                                name="lectureId"
                                value={formData.lectureId}
                                label="Lecture"
                                onChange={handleChange}
                                disabled={lecturesLoading || !formData.courseId}
                                required
                            >
                                {lecturesLoading ? (
                                    <MenuItem disabled>
                                        <CircularProgress size={24} />
                                        Loading lectures...
                                    </MenuItem>
                                ) : lectures.length > 0 ? (
                                    lectures.map((lecture) => (
                                        <MenuItem key={lecture.id} value={lecture.id}>
                                            {lecture.title || `Lecture ${lecture.id}`}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>
                                        {formData.courseId ? 'No lectures available for this course' : 'Please select a course first'}
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                        )}
                        {success && (
                            <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>
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
                            disabled={loading || !formData.title || !formData.lectureId}
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                            sx={{
                                background: '#1A843C',
                                color: '#fff',
                                borderColor: '#EFA61B',
                            }}
                        >
                            {loading ? 'Adding...' : 'Add Exam'}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </>
    );
}

export default AddExamForm;