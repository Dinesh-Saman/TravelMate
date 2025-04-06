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
        destination_contact, // Added this field
        location,
        popular_attractions,
        best_time_to_visit,
        travel_tips,
        accommodation_options,
        activities,
        climate,
        destination_image_url,
      } = req.body;
  
      console.log(req.body);
  
      const existingDestination = await Destination.findOne({ destination_id });
      if (existingDestination) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ message: 'Destination with this ID already exists' });
      }
  
      let destination_image;
      if (req.file) {
        destination_image = `/uploads/destinations/${req.file.filename}`;
      } else if (destination_image_url) {
        destination_image = destination_image_url;
      } else {
        return res.status(400).json({ message: 'Destination image or image URL is required' });
      }
  
      const newDestination = new Destination({
        destination_id,
        destination_name,
        destination_image,
        destination_rating,
        destination_description,
        destination_contact, // Added this field
        location,
        popular_attractions,
        best_time_to_visit,
        travel_tips,
        accommodation_options,
        activities,
        climate,
      });
  
      await newDestination.save();
  
      res.status(201).json({ message: 'Destination created successfully', destination: newDestination });
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      console.error('Error creating destination:', error);
      res.status(500).json({ message: 'Error creating destination', error: error.message });
    }
  }
  
  static async updateDestination(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      const { destination_image_url } = req.body;
  
      const destination = await Destination.findOne({ _id: id });
      if (!destination) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({ message: 'Destination not found' });
      }
  
      if (req.file) {
        updateData.destination_image = `/uploads/destinations/${req.file.filename}`;
  
        if (destination.destination_image && destination.destination_image.startsWith('/uploads/')) {
          const oldImagePath = path.join('public', destination.destination_image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      } else if (destination_image_url) {
        updateData.destination_image = destination_image_url;
        
        if (destination.destination_image && destination.destination_image.startsWith('/uploads/')) {
          const oldImagePath = path.join('public', destination.destination_image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }
  
      const updatedDestination = await Destination.findOneAndUpdate({ _id: id }, updateData, {
        new: true,
        runValidators: true,
      });
  
      res.status(200).json({ message: 'Destination updated successfully', destination: updatedDestination });
    } catch (error) {
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