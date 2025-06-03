import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check credentials
    if (email === 'admin@gmail.com' && password === '123') {
      navigate('/'); // Redirect to homepage
    } else {
      setError(true); // Show error
    }
  };

  return (
    <div className='w-full h-screen flex'>
      {/* Left Side (Pink Background) */}
      <div className='w-1/2 h-full bg-[#841A62]'></div>

      {/* Right Side (Login Form) */}
      <div className='w-1/2 h-full bg-white flex items-center justify-center'>
        <div className='w-80'>
          <h1 className='text-3xl font-bold mb-6 text-center'>Login</h1>
          
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password Input */}
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{ backgroundColor: '#EFA61B', marginTop: '16px' }}
              sx={{
                '&:hover': { backgroundColor: '#d18e16' },
                padding: '10px',
                fontWeight: 'bold',
              }}
            >
              Login
            </Button>
          </form>

          {/* Error Snackbar */}
          <Snackbar
            open={error}
            autoHideDuration={3000}
            onClose={() => setError(false)}
          >
            <Alert severity="error" onClose={() => setError(false)}>
              Invalid email or password!
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
};

export default Login;