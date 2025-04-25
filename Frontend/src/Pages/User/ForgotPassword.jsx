import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Link } from '@material-ui/core';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validate email format
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  // Handle email change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Real-time validation for email
    if (value && !validateEmail(value)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        email: "Invalid email format"
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, email: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    try {
      // Send request to the backend to initiate password reset
      await axios.post('http://localhost:3001/user/forgot-password', { email });
      swal("Success", "Password reset link sent to your email", "success");
    } catch (error) {
      console.error(error);
      swal("Error", "Failed to send password reset link. Please try again.", "error");
    }
  };

  return (
    <Box
      style={{
        backgroundImage: 'url(https://img.freepik.com/free-photo/landscape-morning-fog-mountains-with-hot-air-balloons-sunrise_335224-794.jpg?t=st=1743081705~exp=1743085305~hmac=da43631b8b0992811f94eed06c55d9281676305de45708cb132c48a116780e59&w=996)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <Box
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 8,
          boxShadow: '0px 0px 15px rgba(0,0,0,0.2)',
          width: '100%',
          maxWidth: '450px',
          padding: '30px'
        }}
      >
        {/* Title Section */}
        <Typography 
          variant="h4" 
          gutterBottom 
          style={{
            fontFamily: 'cursive',
            fontWeight: 'bold',
            color: 'purple',
            textAlign: 'center',
            marginBottom: '30px'
          }}
        >
          Forgot Password
        </Typography>

        {/* Form Section */}
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
            helperText={errors.email}
            error={!!errors.email}
            required
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            style={{ marginTop: 25 }}
          >
            Send Reset Link
          </Button>

          {/* Back to Login Link */}
          <Box mt={4} textAlign="center">
            <Typography variant="body1">
              Remember your password?{' '}
              <Link href="/login" style={{ fontWeight: 'bold' }}>
                Login here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;