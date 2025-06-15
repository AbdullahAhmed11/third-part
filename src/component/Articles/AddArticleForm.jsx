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
    Alert,
    Switch,
    FormControlLabel
} from '@mui/material';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

const AddArticleForm = ({ onClose, onSuccess }) => {
    const getUserInfo = () => {
        const token = Cookies.get('token');
        if (!token) return null;
    
        try {
            const decoded = jwtDecode(token);
            const name = decoded.Name;
            const id = decoded.Id;
            const role = decoded.Role;
            const image = decoded.Image;
            return { name, id, role, image };
        } catch (error) {
            console.error('Invalid token:', error);
            return null;
        }
    };
    
    const user = getUserInfo();
    const [loading, setLoading] = useState(false);
    const [lecturesLoading, setLecturesLoading] = useState(false);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    const [lectures, setLectures] = useState([]);
    const [imageFile, setImageFile] = useState(null);

    const [formData, setFormData] = useState({
        Name: '',
        Descripition: '',
        LectureId: '',
        isActive: true
    });

    // Fetch courses on mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const endpoint = user.role === 'Doctor'
                    ? `https://thirdpartyy.runasp.net/api/Courses/GetCourses?page=1&size=20&doctorId=${user.id}`
                    : `https://thirdpartyy.runasp.net/api/Courses/GetCourses?page=1&size=20`;

                const response = await axios.get(endpoint);
                console.log('Courses API Response:', response.data);
                
                const coursesData = response.data || [];
                setCourses(coursesData);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [user?.id, user?.role]);

    // Fetch lectures when courseId changes
    const fetchLectures = async (courseId) => {
        if (!courseId) return;
        
        try {
            setLecturesLoading(true);
            const response = await axios.get(
                `https://thirdpartyy.runasp.net/api/Lectures/GetLectures?courseId=${courseId}`
            );
            console.log('Lectures API Response:', response.data);
            
            const lecturesData = response.data || [];
            setLectures(lecturesData);
            setFormData(prev => ({ ...prev, LectureId: '' })); // Reset lecture selection
        } catch (err) {
            console.error('Error fetching lectures:', err);
            setError(err.message);
        } finally {
            setLecturesLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        fetchLectures(courseId);
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('Name', formData.Name);
            formDataToSend.append('Descripition', formData.Descripition);
            formDataToSend.append('LectureId', formData.LectureId);
            formDataToSend.append('isActive', formData.isActive);
            
            if (imageFile) {
                formDataToSend.append('Image', imageFile);
            }

            const response = await axios.post(
                'https://thirdpartyy.runasp.net/api/Articles/AddArticle',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            console.log('Article added:', response.data);
            onSuccess?.();
            onClose?.();
        } catch (err) {
            console.error('Error adding article:', err);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DialogTitle>
                <Typography variant="h5" component="div">
                    Add Article
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Article Name"
                            name="Name"
                            value={formData.Name}
                            onChange={handleChange}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Description"
                            name="Descripition"
                            value={formData.Descripition}
                            onChange={handleChange}
                            required
                            multiline
                            rows={4}
                        />

                        {/* Course Selection */}
                        <FormControl fullWidth>
                            <InputLabel id="course-select-label">Course</InputLabel>
                            <Select
                                labelId="course-select-label"
                                id="course-select"
                                name="courseId"
                                label="Course"
                                onChange={handleCourseChange}
                                disabled={loading}
                                required
                            >
                                {loading ? (
                                    <MenuItem disabled>
                                        <CircularProgress size={24} />
                                        Loading courses...
                                    </MenuItem>
                                ) : courses.length > 0 ? (
                                    courses.map((course) => (
                                        <MenuItem key={course.id} value={course.id}>
                                            {course.title || `Course ${course.id}`}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No courses available</MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        {/* Lecture Selection - only shown when a course is selected */}
                        <FormControl fullWidth>
                            <InputLabel id="lecture-select-label">Lecture</InputLabel>
                            <Select
                                labelId="lecture-select-label"
                                id="lecture-select"
                                name="LectureId"
                                value={formData.LectureId}
                                label="Lecture"
                                onChange={handleChange}
                                disabled={lecturesLoading || lectures.length === 0}
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
                                    <MenuItem disabled>Select a course first</MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        {/* Image Upload */}
                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                        >
                            Upload Image
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>
                        {imageFile && (
                            <Typography variant="body2">
                                Selected: {imageFile.name}
                            </Typography>
                        )}

                        {/* Active Switch */}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        isActive: e.target.checked
                                    }))}
                                    name="isActive"
                                    color="primary"
                                />
                            }
                            label="Active"
                        />

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
                            {loading ? 'Adding...' : 'Add Article'}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </>
    );
};

export default AddArticleForm;