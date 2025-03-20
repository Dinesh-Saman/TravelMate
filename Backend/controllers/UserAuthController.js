const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/userModel'); // Assuming you have a User model

class UserAuthController {
  // User registration
  async registerUser(req, res) {
    try {
      const { user_id, full_name, email, contact, address, dob, gender, password } = req.body;

      // Check if user already exists with the same email
      const existingUserEmail = await User.findOne({ email });
      if (existingUserEmail) {
        return res.status(409).json({ message: "This email is already registered" });
      }

      // Check if user already exists with the same contact
      const existingUserContact = await User.findOne({ contact });
      if (existingUserContact) {
        return res.status(409).json({ message: "This contact number is already registered" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = new User({
        user_id,
        full_name,
        email,
        contact,
        address,
        dob,
        gender,
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null
      });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // User login
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
      );

      res.status(200).json({
        token,
        user: {
          id: user._id,
          user_id: user.user_id,
          full_name: user.full_name,
          email: user.email
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Forgot password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        // For security reasons, don't reveal that the email doesn't exist
        return res.status(200).json({ message: "If your email exists in our system, you will receive a password reset link" });
      }

      // Generate a reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = Date.now() + 86400000; // 24 hours from now

      // Update user with reset token and expiry
      user.reset_token = resetToken;
      user.reset_token_expiry = resetTokenExpiry;
      await user.save();

      // Create email transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'your_email@gmail.com',
          pass: process.env.EMAIL_APP_PASSWORD  || 'your_email_password'
        }
      });

      // Generate reset URL
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

      // Email options
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your_email@gmail.com',
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `
      };

      // Send email
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "If your email exists in our system, you will receive a password reset link" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

// Reset password with improved debugging
async resetPassword(req, res) {
    try {
      const token = req.params.token;
      const { password } = req.body;
      
      console.log("Reset attempt with token:", token);
      
      // First, just try to find the user by token without expiry check
      const userWithToken = await User.findOne({
        reset_token: token
      });
      
      if (!userWithToken) {
        console.log("No user found with this token");
        return res.status(400).json({ message: "Invalid token - no matching user found" });
      }
      
      console.log("User found. Token expiry:", userWithToken.reset_token_expiry);
      console.log("Current server time:", new Date());
      
      // Now check if token is expired
      if (userWithToken.reset_token_expiry < new Date()) {
        console.log("Token expired");
        return res.status(400).json({ message: "Token has expired" });
      }
      
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Update user password and clear reset token fields
      userWithToken.password = hashedPassword;
      userWithToken.reset_token = null;
      userWithToken.reset_token_expiry = null;
      await userWithToken.save();
      
      console.log("Password reset successful for user:", userWithToken.email);
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

module.exports = new UserAuthController();