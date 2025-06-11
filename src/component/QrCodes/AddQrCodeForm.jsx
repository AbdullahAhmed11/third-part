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
    DialogContent
} from '@mui/material';

const AddQrCodeForm = ({ onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        count: '',   // Number of QR codes to generate
        price: ''    // Value of each QR code
    });

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

        try {
            // Validate inputs
            if (!formData.count || !formData.price) {
                throw new Error("All fields are required!");
            }

            if (isNaN(formData.count) || formData.count <= 0) {
                throw new Error("Number of codes must be a positive integer!");
            }

            if (isNaN(formData.price) || formData.price <= 0) {
                throw new Error("Code value must be a positive number!");
            }

            // API call to generate QR codes
            const response = await axios.post(
                'https://thirdpartyy.runasp.net/api/QRCodes/AddQrCodes',
                {
                    price: parseFloat(formData.price),  // Ensure it's a number
                    count: parseInt(formData.count)      // Ensure it's an integer
                }
            );

            console.log("QR Codes generated successfully:", response.data);
            onSuccess?.();  // Trigger parent callback (e.g., refresh QR list)
            onClose();      // Close the dialog
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to generate QR codes.");
            console.error("API Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DialogTitle>
                <Typography variant="h5" component="div">
                    Generate QR Codes
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Number of Codes"
                            name="count"
                            value={formData.count}
                            onChange={handleChange}
                            required
                            type="number"
                            inputProps={{ min: 1 }}  // Ensures positive numbers
                        />
                        <TextField
                            fullWidth
                            label="Code Value (Price)"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            type="number"
                              // Ensures positive numbers
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
                                '&:hover': { background: '#d32f2f' },
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
                                '&:hover': { background: '#2e7d32' },
                            }}
                        >
                            {loading ? 'Generating...' : 'Generate'}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </>
    );
};

export default AddQrCodeForm;