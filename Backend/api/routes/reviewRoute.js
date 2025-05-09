const express = require('express');
const ReviewController = require('../../controllers/ReviewController');
const router = express.Router();

// Create a new review
router.post('/reviews', ReviewController.createReview);

// Get all reviews (with optional query parameters: status, hotel_id, review_id)
// Example: /reviews?status=approved&hotel_id=123
router.get('/reviews', ReviewController.getAllReviews);

// Get a single review by ID (works with both MongoDB _id and review_id)
router.get('/reviews/:id', ReviewController.getReviewById);

// Update a review status (typically admin-only)
router.put('/reviews/:id', ReviewController.updateReview);

// Update a review status (logged in user only)
router.put('/user-review/:id', ReviewController.updateUserReview);

// Delete a review
router.delete('/reviews/:id', ReviewController.deleteReview);

// Get all approved reviews for a specific hotel (public endpoint)
router.get('/hotels/:hotel_id/reviews', ReviewController.getHotelReviews);

// Get average rating for a specific hotel
router.get('/hotels/:hotel_id/average-rating', ReviewController.getHotelAverageRating);

module.exports = router;