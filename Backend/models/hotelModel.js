const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
  hotel_id: {
    type: String,
    required: true,
    unique: true, // Ensure hotel_id is unique
  },
  hotel_name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
    unique: true, // Assuming phone numbers are unique
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
  website: {
    type: String,
    required: true,
  },
  star_rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // Star rating between 1 and 5
  },
  description: {
    type: String,
    required: true,
  },
  hotel_image: {
    type: String, // Store the URL or file path of the image
    required: true,
  },
  hotel_packages: [
    {
      package_name: {
        type: String,
        required: true,
      },
      package_description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      inclusions: {
        type: [String], // Array of strings for inclusions
        required: true,
      },
      validity_period: {
        type: Date, // Validity period for the package
        required: true,
      },
    },
  ],
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Add index for faster lookup by hotel_id
hotelSchema.index({ hotel_id: 1 });

module.exports = mongoose.model('Hotel', hotelSchema);