const express = require('express');
const HotelController = require('../../controllers/HotelController');
const upload = require('../../config/multer'); // Assuming you have a multer configuration file

const router = express.Router();

// Create a new hotel
router.post('/add-hotel', HotelController.createHotel);

// Get all hotels
router.get('/get-hotels', HotelController.getAllHotels);

// Get a single hotel by ID
router.get('/hotels/:id', HotelController.getHotelById);

// Update a hotel by ID
router.put('/hotels/:id', HotelController.updateHotel);

// Delete a hotel by ID
router.delete('/delete-hotel/:id', HotelController.deleteHotel);

// Add a package to a hotel
router.post('/hotels/:id/packages', HotelController.addPackageToHotel);

// Remove a package from a hotel
router.delete('/hotels/:id/packages/:packageId', HotelController.removePackageFromHotel);

// Image upload route
router.post('/upload', upload.single('image'), HotelController.uploadImage);

module.exports = router;