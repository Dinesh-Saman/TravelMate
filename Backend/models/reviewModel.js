const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  review_id: {
    type: String,
    required: true,
    unique: true,
  },
  hotel_id: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review_text: {
    type: String,
    required: true,
  },
  review_status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  review_date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Add indexes for faster queries
reviewSchema.index({ review_id: 1 });
reviewSchema.index({ hotel_id: 1 });
reviewSchema.index({ review_status: 1 });

module.exports = mongoose.model('Review', reviewSchema);