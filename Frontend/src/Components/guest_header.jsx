import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Menu, MenuItem, Avatar } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Link, useNavigate } from 'react-router-dom'; 
import './guest_header.css';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [firstName, setFirstName] = useState('Admin'); // Default to Admin
  const token = localStorage.getItem('token'); 
  const navigate = useNavigate(); 

// Modify the useEffect in Header.js
useEffect(() => {
  // Check if username exists in localStorage
  const storedUsername = localStorage.getItem('username');
  
  if (storedUsername) {
    // If username exists in localStorage, use it
    setFirstName(storedUsername);
  } else if (token) {
    // If no username in localStorage but token exists, try to fetch from server
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:3002/user-profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setFirstName(data.firstName);
          // Store all user details in localStorage for future use
          localStorage.setItem('username', data.firstName);
          localStorage.setItem('userEmail', data.email);
          localStorage.setItem('userId', data._id);
          // Add more details as needed
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }
}, [token]);

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('username'); // Remove username when logging out
    setFirstName('Admin'); // Reset to default
    handleClose();
    navigate('/login'); 
  };

  return (
    <Box className="header-container">
      <Box className="guest_header">
        <Box className="contact-section">
          <Typography variant="body1">
            Call Now: <br />
            0717901354 / 0703399599
          </Typography>
        </Box>

        <Box className="logo-section">
          <img 
            src="https://intercambioeviagem.com.br/wp-content/uploads/2016/08/TravelMate-Logo.png" 
            alt="Logo" 
            className="logo" 
          />
        </Box>

        <Box className="icon-section">
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>

          {/* User Profile Section */}
          {token ? (
            <>
              <Typography variant="body1" style={{ marginLeft: '8px', color: '#fff' }}>
                Hi, {firstName}
              </Typography>
              <IconButton color="inherit" onClick={handleProfileClick}>
                <Avatar 
                  src="https://www.w3schools.com/howto/img_avatar.png" 
                  alt="User Avatar" 
                  style={{ width: 40, height: 40 }}
                />
              </IconButton>
            </>
          ) : (
            <>
              <Typography variant="body1" style={{ marginLeft: '8px', color: '#fff' }}>
                Hi, Admin
              </Typography>
              <IconButton color="inherit" onClick={handleProfileClick}>
                <Avatar 
                  src="https://www.w3schools.com/howto/img_avatar.png" 
                  alt="Guest Avatar" 
                  style={{ width: 40, height: 40 }}
                />
              </IconButton>
            </>
          )}

          {/* Profile Dropdown Menu */}
          <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
            {token ? (
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            ) : (
              <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>
            )}
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;