import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'; // ✅ import js-cookie

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('PhoneOrEmail', emailOrPhone);
    formData.append('Password', password);

    try {
      const response = await axios.post(
        'https://thirdpartyy.runasp.net/api/Users/Login',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data) {
        // ✅ Store token in cookies
        Cookies.set('token', response.data, { expires: 7 }); // expires in 7 days

        console.log('Login success, token:', response.data);
        // Navigate to home or dashboard
        navigate('/');
      } else {
        throw new Error('Token not found in response');
      }
    } catch (err) {
      console.error('Login Failed:', err);
      setErrorMessage('Invalid email/phone or password!');
      setError(true);
    }
  };

  return (
    <div className='w-full h-screen flex'>
      {/* Left Side */}
      <div className='w-1/2 h-full bg-[#841A62]'></div>

      {/* Right Side */}
      <div className='w-1/2 h-full bg-white flex items-center justify-center'>
        <div className='w-80'>
          <h1 className='text-3xl font-bold mb-6 text-center'>Login</h1>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email or Phone"
              type="text"
              fullWidth
              margin="normal"
              variant="outlined"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
            />
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

          <Snackbar open={error} autoHideDuration={3000} onClose={() => setError(false)}>
            <Alert severity="error" onClose={() => setError(false)}>
              {errorMessage}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
};

export default Login;
