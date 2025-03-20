const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/UserAuthController');

// User registration route
router.post('/register', userAuthController.registerUser);

// User login route
router.post('/login', userAuthController.loginUser);

// Forgot password route
router.post('/forgot-password', userAuthController.forgotPassword);

// Reset password route
router.post('/reset-password/:token', userAuthController.resetPassword);

module.exports = router;