import React, { useState } from 'react';
import {
  TextField, Button, Box, Typography, FormHelperText, Link, Paper, List, ListItem
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import Header from '../../Components/navbar';
import Sidebar from '../../Components/owner_sidebar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  // Handle password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrors(prevErrors => ({ ...prevErrors, password: '' }));
  };

  // Validate the login form
  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required.";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format.";
    if (!password) newErrors.password = "Password is required.";
    return newErrors;
  };

// Modify the handleSubmit function in Login.js
const handleSubmit = async (event) => {
  event.preventDefault();
  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  try {
    // Send login request to the backend
    const response = await axios.post('http://localhost:3001/user/login', {
      email,
      password
    });

    // If login is successful, store user details and token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Save user details to localStorage
      if (response.data.user) {
        localStorage.setItem('username', response.data.user.firstName || '');
        localStorage.setItem('userEmail', response.data.user.email || '');
        localStorage.setItem('userId', response.data.user._id || '');
        // You can add more user details as needed
      }
      swal("Success", "Logged in successfully!", "success");
      navigate('/dashboard'); // Redirect to the dashboard or home page
    }
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 401) {
      swal("Error", "Invalid email or password", "error");
    } else {
      swal("Error", "Something went wrong. Please try again.", "error");
    }
  }
};

  return (
    <Box>
      <Header />
      <Box display="flex">
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          style={{
            backgroundColor: 'white',
            borderRadius: 8,
            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
            flex: 1,
            margin: '15px'
          }}
        >
          {/* Title Section */}
          <Box
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h4" gutterBottom style={{
              fontFamily: 'cursive',
              fontWeight: 'bold',
              color: 'purple',
              textAlign: 'center',
              marginTop: '30px'
            }}>
              Login to TravelMate
            </Typography>
          </Box>

          <Box display="flex" width="100%">
            {/* Form Section */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ flex: 1, padding: '20px', margin: '15px' }}
            >
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

                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={handlePasswordChange}
                  helperText={errors.password}
                  error={!!errors.password}
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
                  Login
                </Button>

                {/* Forgot Password and Reset Password Links */}
                <Box mt={2} textAlign="center">
                  <Link href="/forgot-password" style={{ marginRight: '10px' }}>
                    Forgot Password?
                  </Link>
                  <Link href="/reset-password">
                    Reset Password
                  </Link>
                </Box>

                {/* Don't have an account? Register Section */}
                <Box mt={4} textAlign="center">
                  <Typography variant="body1">
                    Don't have an account?{' '}
                    <Link href="/register" style={{ fontWeight: 'bold' }}>
                      Register here
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Image Section */}
            <Box
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '20px',
                margin: '25px',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1620899011820-e22f724e8084?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3ViYXJ1JTIwYnJ6fGVufDB8fDB8fHww"
                alt="Login"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '10px',
                  marginBottom: '20px'
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;