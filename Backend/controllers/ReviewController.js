const Review = require('../models/reviewModel');
const Hotel = require('../models/hotelModel');
const mongoose = require('mongoose');

class ReviewController {
  // Create a new review
  static async createReview(req, res) {
    try {
      const { hotel_id, user_name, rating, review_text } = req.body;

      // Validate that the hotel exists
      const hotel = await Hotel.findById(hotel_id);
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      // Generate a unique review_id
      const review_id = `REV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Create the review
      const newReview = new Review({
        review_id,
        hotel_id,
        user_name,
        rating,
        review_text,
        review_status: 'pending', // Default status
      });

      await newReview.save();

      res.status(201).json({ 
        message: 'Review submitted successfully. It will be visible after approval.', 
        review: newReview 
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error creating review', 
        error: error.message 
      });
    }
  }

  // Get all reviews (with optional filtering)
  static async getAllReviews(req, res) {
    try {
      const { status, hotel_id, review_id } = req.query;
      const filter = {};

      if (status) {
        filter.review_status = status;
      }

      if (hotel_id) {
        filter.hotel_id = hotel_id;
      }

      if (review_id) {
        filter.review_id = review_id;
      }

      const reviews = await Review.find(filter).populate('hotel_id', 'hotel_name');
      res.status(200).json({ reviews });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching reviews', 
        error: error.message 
      });
    }
  }

  // Get a single review by ID
  static async getReviewById(req, res) {
    try {
      const { id } = req.params;
      const review = await Review.findOne({ 
        $or: [
          { _id: id },
          { review_id: id }
        ]
      }).populate('hotel_id', 'hotel_name');

      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      res.status(200).json({ review });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching review', 
        error: error.message 
      });
    }
  }

  // Update a review (typically for admin to change status)
  static async updateReview(req, res) {
    try {
      const { id } = req.params;
      const { review_status } = req.body;

      // Only allow updating status for simplicity
      const updatedReview = await Review.findOneAndUpdate(
        { 
          $or: [
            { _id: id },
            { review_id: id }
          ]
        },
        { review_status },
        { new: true, runValidators: true }
      );

      if (!updatedReview) {
        return res.status(404).json({ message: 'Review not found' });
      }

      res.status(200).json({ 
        message: 'Review updated successfully', 
        review: updatedReview 
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error updating review', 
        error: error.message 
      });
    }
  }

  // Delete a review
  static async deleteReview(req, res) {
    try {
      const { id } = req.params;
      const deletedReview = await Review.findOneAndDelete({ 
        $or: [
          { _id: id },
          { review_id: id }
        ]
      });

      if (!deletedReview) {
        return res.status(404).json({ message: 'Review not found' });
      }

      res.status(200).json({ 
        message: 'Review deleted successfully', 
        review: deletedReview 
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error deleting review', 
        error: error.message 
      });
    }
  }

  // Get reviews for a specific hotel (public endpoint)
  static async getHotelReviews(req, res) {
    try {
      const { hotel_id } = req.params;
      
      // Only return approved reviews for public access
      const reviews = await Review.find({ 
        hotel_id, 
        review_status: 'approved' 
      }).sort({ createdAt: -1 });

      res.status(200).json({ reviews });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching hotel reviews', 
        error: error.message 
      });
    }
  }

  // Calculate average rating for a hotel
  static async getHotelAverageRating(req, res) {
    try {
      const { hotel_id } = req.params;
      
      const result = await Review.aggregate([
        { 
          $match: { 
            hotel_id: mongoose.Types.ObjectId(hotel_id), 
            review_status: 'approved' 
          } 
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 }
          }
        }
      ]);

      if (result.length === 0) {
        return res.status(200).json({ 
          averageRating: 0, 
          totalReviews: 0 
        });
      }

      res.status(200).json({ 
        averageRating: result[0].averageRating.toFixed(1), 
        totalReviews: result[0].totalReviews 
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error calculating average rating', 
        error: error.message 
      });
    }
  }
}

module.exports = ReviewController;