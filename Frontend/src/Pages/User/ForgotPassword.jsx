import React, { useState } from 'react';
import { TextField, Button, Box, Typography, FormHelperText, Link } from '@material-ui/core';
import axios from 'axios';
import swal from 'sweetalert';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

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
    <Box>
      <Typography variant="h4" gutterBottom style={{ textAlign: 'center', marginTop: '30px' }}>
        Forgot Password
      </Typography>
      <Box component="form" width="100%" noValidate autoComplete="off" onSubmit={handleSubmit}>
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
      </Box>
    </Box>
  );
};

export default ForgotPassword;