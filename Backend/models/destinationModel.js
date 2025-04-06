const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const destinationSchema = new Schema({
  destination_id: {
    type: String,
    required: true,
    unique: true,
  },
  destination_name: {
    type: String,
    required: true,
  },
  destination_image: {
    type: String,
    required: true,
  },
  destination_rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  destination_description: {
    type: String,
    required: true,
  },
  destination_contact: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  popular_attractions: {
    type: [String],
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
    type: [String],
    required: true,
  },
  activities: {
    type: [String],
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
    ],
  },
}, { timestamps: true });

destinationSchema.index({ destination_id: 1 });

module.exports = mongoose.model('Destination', destinationSchema);