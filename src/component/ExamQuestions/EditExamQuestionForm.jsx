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
    FormControl,
    Select,
    MenuItem,
    IconButton,
    Divider
} from '@mui/material';
const EditExamQuestionForm = ({ question, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        Text: question?.text || '',
        CorrectAnswer: question?.correctAnswer || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    return (
    <>
        <DialogTitle>
                <Typography variant="h5" component="div">
                    Edit Exam Question
                </Typography>
        </DialogTitle>
        <DialogContent>
                        <Box component="form" sx={{ mt: 2 }}>
                            <Stack spacing={3}>
                                {/* Question Text */}
                                <TextField
                                    fullWidth
                                    label="Question Text"
                                    name="Text"
                                    value={formData.Text}
                                    required
                                    multiline
                                    rows={3}
                                />
        
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
                               <MenuItem  value={formData.correctAnswer}>
                                       {formData.correctAnswer}
                                    </MenuItem>
                            </Select>
                        </FormControl>
        
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
                                        {loading ? 'Editing...' : 'Edit Question'}
                                    </Button>
                                </Box>
                            </Stack>
                        </Box>
                    </DialogContent>
    </>
  )
}

export default EditExamQuestionForm