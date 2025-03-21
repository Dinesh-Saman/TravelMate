const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const destinationSchema = new Schema({
  destination_id: {
    type: String,
    required: true,
    unique: true, // Ensure destination_id is unique
  },
  destination_name: {
    type: String,
    required: true,
  },
  destination_image: {
    type: String, // Store the URL or file path of the image
    required: true,
  },
  destination_rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // Rating between 1 and 5
  },
  destination_description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  popular_attractions: {
    type: [String], // Array of strings for popular attractions
    required: true,
  },
  best_time_to_visit: {
    type: String,
    required: true,
  },
  travel_tips: {
    type: String,
    required: true,
  },
  accommodation_options: {
    type: [String], // Array of strings for accommodation options
    required: true,
  },
  activities: {
    type: [String], // Array of strings for activities
    required: true,
  },
  climate: {
    type: String,
    required: true,
    enum: [
      'Tropical',
      'Temperate',
      'Arid (Desert)',
      'Mediterranean',
      'Continental',
      'Polar',
      'Mountain',
    ], // Dropdown options for climate
  },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Add index for faster lookup by destination_id
destinationSchema.index({ destination_id: 1 });

module.exports = mongoose.model('Destination', destinationSchema);