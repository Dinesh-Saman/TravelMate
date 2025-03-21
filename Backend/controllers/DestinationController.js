const Destination = require('../models/destinationModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/uploads/destinations';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `destination_${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Filter for image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Initialize multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

class DestinationController {
  // Middleware to handle file uploads
  static uploadDestinationImage = upload.single('destination_image');

  static async createDestination(req, res) {
    console.log("Request Body:", req.body);
    try {
      const {
        destination_id,
        destination_name,
        destination_rating,
        destination_description,
        location,
        popular_attractions,
        best_time_to_visit,
        travel_tips,
        accommodation_options,
        activities,
        climate,
        destination_image_url, // Ensure this is extracted from req.body
      } = req.body;
  
      console.log(req.body); // Log the request body to verify the payload
  
      // Check if the destination already exists
      const existingDestination = await Destination.findOne({ destination_id });
      if (existingDestination) {
        if (req.file) {
          fs.unlinkSync(req.file.path); // Delete uploaded file if it exists
        }
        return res.status(400).json({ message: 'Destination with this ID already exists' });
      }
  
      // Handle the destination image (either from file upload or URL)
      let destination_image;
      if (req.file) {
        // If a file was uploaded, use its path
        destination_image = `/uploads/destinations/${req.file.filename}`;
      } else if (destination_image_url) {
        // Use the image URL provided in the request body
        destination_image = destination_image_url;
      } else {
        // If neither file nor URL is provided, return an error
        return res.status(400).json({ message: 'Destination image or image URL is required' });
      }
  
      // Create a new destination
      const newDestination = new Destination({
        destination_id,
        destination_name,
        destination_image, // Use the resolved image URL or file path
        destination_rating,
        destination_description,
        location,
        popular_attractions,
        best_time_to_visit,
        travel_tips,
        accommodation_options,
        activities,
        climate,
      });
  
      // Save the destination to the database
      await newDestination.save();
  
      res.status(201).json({ message: 'Destination created successfully', destination: newDestination });
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path); // Delete uploaded file on error
      }
      console.error('Error creating destination:', error);
      res.status(500).json({ message: 'Error creating destination', error: error.message });
    }
  }

  // Update a destination by ID
  static async updateDestination(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      const { destination_image_url } = req.body; // Added support for image URL

      // Find the destination before updating
      const destination = await Destination.findOne({ _id: id });
      if (!destination) {
        // If file was uploaded, delete it since we're not updating
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({ message: 'Destination not found' });
      }

      // Handle the destination image (either from file upload or URL)
      if (req.file) {
        // Create URL path for the uploaded image
        updateData.destination_image = `/uploads/destinations/${req.file.filename}`;

        // Delete the old image file if it exists and is not a URL
        if (destination.destination_image && destination.destination_image.startsWith('/uploads/')) {
          const oldImagePath = path.join('public', destination.destination_image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      } else if (destination_image_url) {
        // Use the image URL provided in the request body
        updateData.destination_image = destination_image_url;
        
        // Delete the old image file if it exists and is not a URL
        if (destination.destination_image && destination.destination_image.startsWith('/uploads/')) {
          const oldImagePath = path.join('public', destination.destination_image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      // Find and update the destination
      const updatedDestination = await Destination.findOneAndUpdate({ _id: id }, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Validate the update data
      });

      res.status(200).json({ message: 'Destination updated successfully', destination: updatedDestination });
    } catch (error) {
      // If file was uploaded, delete it on error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ message: 'Error updating destination', error: error.message });
    }
  }

  // Get all destinations (unchanged)
  static async getAllDestinations(req, res) {
    try {
      const destinations = await Destination.find();
      res.status(200).json({ destinations });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching destinations', error: error.message });
    }
  }

  // Get a single destination by ID (unchanged)
  static async getDestinationById(req, res) {
    try {
      const { id } = req.params;
      const destination = await Destination.findOne({ _id: id });

      if (!destination) {
        return res.status(404).json({ message: 'Destination not found' });
      }

      res.status(200).json({ destination });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching destination', error: error.message });
    }
  }

  // Delete a destination by ID (unchanged)
  static async deleteDestination(req, res) {
    try {
      const { id } = req.params;
      const deletedDestination = await Destination.findOneAndDelete({ _id: id });

      if (!deletedDestination) {
        return res.status(404).json({ message: 'Destination not found' });
      }

      // Delete the destination image file if it exists and is not a URL
      if (deletedDestination.destination_image && deletedDestination.destination_image.startsWith('/uploads/')) {
        const imagePath = path.join('public', deletedDestination.destination_image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      res.status(200).json({ message: 'Destination deleted successfully', destination: deletedDestination });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting destination', error: error.message });
    }
  }

  // Handle image upload (unchanged)
  static async uploadImage(req, res) {
    try {
      // Check if a file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      // Create the URL for the uploaded image
      const imageUrl = `/uploads/destinations/${req.file.filename}`;

      // Return the image URL
      res.status(200).json({ imageUrl });
    } catch (error) {
      // If an error occurs, delete the uploaded file
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ message: 'Error uploading image', error: error.message });
    }
  }
}

module.exports = DestinationController;