import React, { useState } from 'react';
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
    FormControl,
    Select,
    MenuItem,
    IconButton,
    Divider
} from '@mui/material';
import { IoIosAddCircle } from "react-icons/io";
import { CiSquareRemove } from "react-icons/ci";
import {useParams} from 'react-router-dom';
const AddExamQuestionForm = ({ onClose, onSuccess }) => {
    const { id } = useParams(); // Get ID from URL params
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        Text: '',
        Image: null,
        CorrectAnswer: '',
        Answers: ['', ''] // Start with 2 empty answer fields
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...formData.Answers];
        newAnswers[index] = value;
        setFormData(prev => ({
            ...prev,
            Answers: newAnswers
        }));
    };

    const addAnswerField = () => {
        setFormData(prev => ({
            ...prev,
            Answers: [...prev.Answers, '']
        }));
    };

    const removeAnswerField = (index) => {
        if (formData.Answers.length <= 2) return;
        
        const newAnswers = formData.Answers.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            Answers: newAnswers,
            // Reset correct answer if we removed the selected one
            CorrectAnswer: prev.CorrectAnswer === index.toString() ? '' : prev.CorrectAnswer
        }));
    };

    const handleImageChange = (e) => {
        setFormData(prev => ({
            ...prev,
            Image: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate at least 2 answers exist
        if (formData.Answers.length < 2) {
            setError('Please provide at least 2 answers');
            setLoading(false);
            return;
        }

        // Validate correct answer is selected
        if (!formData.CorrectAnswer) {
            setError('Please select the correct answer');
            setLoading(false);
            return;
        }

        try {
            const formPayload = new FormData();
            formPayload.append('Text', formData.Text);
            formPayload.append('ExamId', id);
            formPayload.append('CorrectAnswer', formData.CorrectAnswer);
            formData.Answers.forEach((answer, index) => {
                formPayload.append(`Answers[${index}]`, answer);
            });
            if (formData.Image) {
                formPayload.append('Image', formData.Image);
            }

            const response = await axios.post(
                'https://thirdpartyy.runasp.net/api/Questions/AddQuestion',
                formPayload,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            onSuccess(response.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add question');
            console.error('Error adding question:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DialogTitle>
                <Typography variant="h5" component="div">
                    Add Exam Question
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <Stack spacing={3}>
                        {/* Question Text */}
                        <TextField
                            fullWidth
                            label="Question Text"
                            name="Text"
                            value={formData.Text}
                            onChange={handleChange}
                            required
                            multiline
                            rows={3}
                        />

                        {/* Image Upload */}
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Question Image (Optional)
                            </Typography>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Box>

                        <Divider />

                        {/* Answer Options */}
                        <Typography variant="h6">Answer Options</Typography>
                        {formData.Answers.map((answer, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TextField
                                    fullWidth
                                    label={`Answer ${index + 1}`}
                                    value={answer}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    required
                                />
                                <IconButton
                                    onClick={() => removeAnswerField(index)}
                                    color="error"
                                    disabled={formData.Answers.length <= 2}
                                >
                                    <CiSquareRemove />
                                </IconButton>
                                {index === formData.Answers.length - 1 && (
                                    <IconButton onClick={addAnswerField} color="primary">
                                        <IoIosAddCircle />
                                    </IconButton>
                                )}
                            </Box>
                        ))}

                        {/* Correct Answer Selection */}
                        <FormControl fullWidth>
                            <Typography variant="subtitle1" gutterBottom>
                                Select Correct Answer
                            </Typography>
                            <Select
                                value={formData.CorrectAnswer}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    CorrectAnswer: e.target.value
                                }))}
                                required
                            >
                                <MenuItem value="" disabled>
                                    Select the correct answer
                                </MenuItem>
                                {formData.Answers.map((_, index) => (
                                    <MenuItem key={index} value={index.toString()}>
                                        Answer {index + 1}
                                    </MenuItem>
                                ))}
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
                            {loading ? 'Adding...' : 'Add Question'}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </>
    );
}

export default AddExamQuestionForm;