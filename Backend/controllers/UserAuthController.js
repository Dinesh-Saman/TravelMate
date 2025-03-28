const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/userModel'); // Import the User model

class UserAuthController {
  // User registration
  async registerUser(req, res) {
    try {
      const { user_id, full_name, email, contact, address, dob, gender, password, profile_picture } = req.body;

      // Check if user already exists
      const existingUserEmail = await User.findOne({ email });
      if (existingUserEmail) {
        return res.status(409).json({ message: "This email is already registered" });
      }

      const existingUserContact = await User.findOne({ contact });
      if (existingUserContact) {
        return res.status(409).json({ message: "This contact number is already registered" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user with profile_picture
      const newUser = new User({
        user_id,
        full_name,
        email,
        contact,
        address,
        dob,
        gender,
        profile_picture: profile_picture || '',
        password: hashedPassword,
      });

      await newUser.save();
      res.status(201).json({ 
        message: "User registered successfully",
        user: {
          id: newUser._id,
          user_id: newUser.user_id,
          full_name: newUser.full_name,
          email: newUser.email,
          profile_picture: newUser.profile_picture
        }
      });
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
          email: user.email,
        },
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
          pass: process.env.EMAIL_APP_PASSWORD || 'your_email_password',
        },
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
        `,
      };

      // Send email
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "If your email exists in our system, you will receive a password reset link" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Reset password
  async resetPassword(req, res) {
    try {
      const token = req.params.token;
      const { password } = req.body;

      // Find user by reset token
      const user = await User.findOne({
        reset_token: token,
        reset_token_expiry: { $gt: Date.now() }, // Ensure token is not expired
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update user password and clear reset token fields
      user.password = hashedPassword;
      user.reset_token = null;
      user.reset_token_expiry = null;
      await user.save();

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error: error.message });
    }
  }

  // Get a single user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findOne({ _id: id });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error: error.message });
    }
  }

  // Update a user by ID
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      // Find and update the user
      const updatedUser = await User.findOneAndUpdate({ _id: id }, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Validate the update data
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error: error.message });
    }
  }

  // Delete a user by ID
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deletedUser = await User.findOneAndDelete({ _id: id });

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error: error.message });
    }
  }

  // Get user profile (updated to handle profile_picture)
  async getUserProfile(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      const user = await User.findById(decoded.id).select('-password -reset_token -reset_token_expiry');
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ 
        user: {
          id: user._id,
          user_id: user.user_id,
          full_name: user.full_name,
          email: user.email,
          contact: user.contact,
          address: user.address,
          dob: user.dob,
          gender: user.gender,
          profile_picture: user.profile_picture,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      console.error(error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: "Invalid token" });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Update profile (updated to handle profile_picture)
  async updateProfile(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      const { full_name, email, contact, address, dob, gender, profile_picture, password } = req.body;

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update profile picture if provided
      if (profile_picture !== undefined) {
        user.profile_picture = profile_picture;
      }

      // Update other fields if provided
      if (full_name) user.full_name = full_name;
      if (email) {
        const existingUser = await User.findOne({ email, _id: { $ne: decoded.id } });
        if (existingUser) {
          return res.status(409).json({ message: "Email already in use" });
        }
        user.email = email;
      }
      if (contact) user.contact = contact;
      if (address) user.address = address;
      if (dob) user.dob = dob;
      if (gender) user.gender = gender;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      await user.save();

      const updatedUser = await User.findById(decoded.id).select('-password -reset_token -reset_token_expiry');
      res.status(200).json({ 
        message: "Profile updated successfully", 
        user: updatedUser 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

module.exports = new UserAuthController();