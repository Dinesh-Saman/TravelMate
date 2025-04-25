import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Link,
  Card,
  CardContent
} from '@material-ui/core';
import axios from 'axios';
import swal from 'sweetalert';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate inputs
    if (!password || !confirmPassword) {
      setErrors({ password: "Please fill in all fields" });
      return;
    }
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      await axios.post(`http://localhost:3001/user/reset-password/${token}`, { password });
      swal("Success", "Password reset successfully!", "success")
        .then(() => navigate('/login'));
    } catch (error) {
      console.error(error);
      swal("Error", error.response?.data?.message || "Failed to reset password. Please try again.", "error");
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
      <Card
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 8,
          boxShadow: '0px 0px 15px rgba(0,0,0,0.2)',
          width: '100%',
          maxWidth: '450px'
        }}
      >
        <CardContent style={{ padding: '40px' }}>
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
            Reset Password
          </Typography>

          {/* Form Section */}
          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText={errors.password}
              error={!!errors.password}
              required
              style={{ marginBottom: '20px' }}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Confirm New Password"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              helperText={errors.confirmPassword}
              error={!!errors.confirmPassword}
              required
              style={{ marginBottom: '20px' }}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              style={{ 
                marginTop: '25px',
                padding: '12px',
                fontSize: '1rem',
                fontWeight: 'bold',
                backgroundColor: '#6a1b9a',
                '&:hover': {
                  backgroundColor: '#4a148c'
                }
              }}
            >
              Reset Password
            </Button>

            {/* Back to Login Link */}
            <Box mt={4} textAlign="center">
              <Typography variant="body1">
                Remember your password?{' '}
                <Link 
                  href="/login" 
                  style={{ 
                    fontWeight: 'bold',
                    color: '#6a1b9a',
                    cursor: 'pointer'
                  }}
                >
                  Login here
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResetPassword;