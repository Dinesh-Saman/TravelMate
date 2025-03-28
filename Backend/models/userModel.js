const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female'],
  },
  profile_picture: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true,
  },
  reset_token: {
    type: String,
    default: null,
  },
  reset_token_expiry: {
    type: Date,
    default: null,
  },
  last_login: {
    type: Date,
    default: null,
  }
}, { timestamps: true });

userSchema.index({ reset_token: 1 });

module.exports = mongoose.model('User', userSchema);