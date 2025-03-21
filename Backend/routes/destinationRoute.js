const express = require('express');
const DestinationController = require('../controllers/DestinationController'); // Import the Destination Controller
const upload = require('../config/multer'); // Assuming you have a multer configuration file

const router = express.Router();

// Create a new destination
router.post('/add-destination', DestinationController.createDestination);

// Get all destinations
router.get('/get-destinations', DestinationController.getAllDestinations);

// Get a single destination by ID
router.get('/destinations/:id', DestinationController.getDestinationById);

// Update a destination by ID
router.put('/update-destination/:id', DestinationController.updateDestination);

// Delete a destination by ID
router.delete('/delete-destination/:id', DestinationController.deleteDestination);

// Image upload route
router.post('/upload', upload.single('image'), DestinationController.uploadImage);

module.exports = router;