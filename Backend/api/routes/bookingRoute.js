const express = require('express');
const router = express.Router();
const BookingController = require('../../controllers/BookingController');

// Create a new booking
router.post('/', BookingController.createBooking);

// Get all bookings
router.get('/', BookingController.getAllBookings);

// Get a specific booking by ID
router.get('/:id', BookingController.getBookingById);

// Get all bookings for a specific user
router.get('/user/:username', BookingController.getUserBookings);

// Update a booking
router.put('/:id', BookingController.updateBooking);

// Cancel/delete a booking
router.delete('/:id', BookingController.cancelBooking);

// Get all bookings for a specific hotel
router.get('/hotel/:hotelName', BookingController.getBookingsByHotel);

module.exports = router;