const Hotel = require('../models/hotelModel'); // Import the Hotel model
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'public/uploads/hotels';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, `hotel_${Date.now()}${path.extname(file.originalname)}`);
  }
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

  class HotelController {
    static uploadHotelImage = upload.single('hotel_image');
  
    static async createHotel(req, res) {
      try {
        const {
          hotel_id,
          hotel_name,
          address,
          city,
          phone_number,
          email,
          website,
          star_rating,
          description,
          hotel_packages,
        } = req.body;
    
        const existingHotel = await Hotel.findOne({ hotel_id });
        if (existingHotel) {
          if (req.file) fs.unlinkSync(req.file.path);
          return res.status(400).json({ message: 'Hotel with this ID already exists' });
        }
    
        let hotel_image = req.body.hotel_image;
        if (req.file) {
          hotel_image = `/uploads/hotels/${req.file.filename}`;
        }
    
        let parsedPackages = [];
        if (hotel_packages) {
          if (typeof hotel_packages === 'string') {
            try {
              parsedPackages = JSON.parse(hotel_packages);
            } catch (parseError) {
              if (req.file) fs.unlinkSync(req.file.path);
              return res.status(400).json({ message: 'Invalid hotel_packages format' });
            }
          } else if (Array.isArray(hotel_packages)) {
            parsedPackages = hotel_packages;
          }
  
          // Validate packages
          parsedPackages.forEach(pkg => {
            if (!pkg.no_of_rooms || pkg.no_of_rooms < 1) {
              throw new Error('Each package must have at least 1 room');
            }
          });
        }
    
        const newHotel = new Hotel({
          hotel_id,
          hotel_name,
          address,
          city,
          phone_number,
          email,
          website,
          star_rating,
          description,
          hotel_image,
          hotel_packages: parsedPackages,
        });
    
        await newHotel.save();
        res.status(201).json({ message: 'Hotel created successfully', hotel: newHotel });
      } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error('Error creating hotel:', error);
        res.status(500).json({ message: 'Error creating hotel', error: error.message });
      }
    }
  
    static async getAllHotels(req, res) {
      try {
        const hotels = await Hotel.find();
        res.status(200).json({ hotels });
      } catch (error) {
        res.status(500).json({ message: 'Error fetching hotels', error: error.message });
      }
    }
  
    static async getHotelById(req, res) {
      try {
        const { id } = req.params;
        const hotel = await Hotel.findOne({ _id: id });
  
        if (!hotel) {
          return res.status(404).json({ message: 'Hotel not found' });
        }
  
        res.status(200).json({ hotel });
      } catch (error) {
        res.status(500).json({ message: 'Error fetching hotel', error: error.message });
      }
    }
  
    static async updateHotel(req, res) {
      try {
        const { id } = req.params;
        const updateData = { ...req.body };
  
        const hotel = await Hotel.findOne({ _id: id });
        if (!hotel) {
          if (req.file) fs.unlinkSync(req.file.path);
          return res.status(404).json({ message: 'Hotel not found' });
        }
  
        if (req.file) {
          updateData.hotel_image = `/uploads/hotels/${req.file.filename}`;
          if (hotel.hotel_image && hotel.hotel_image.startsWith('/uploads/')) {
            const oldImagePath = path.join('public', hotel.hotel_image);
            if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
          }
        }
  
        if (typeof updateData.hotel_packages === 'string') {
          try {
            updateData.hotel_packages = JSON.parse(updateData.hotel_packages);
          } catch (error) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Invalid hotel_packages format' });
          }
        }
  
        // Validate packages if they exist in update data
        if (updateData.hotel_packages) {
          updateData.hotel_packages.forEach(pkg => {
            if (!pkg.no_of_rooms || pkg.no_of_rooms < 1) {
              throw new Error('Each package must have at least 1 room');
            }
          });
        }
  
        const updatedHotel = await Hotel.findOneAndUpdate(
          { _id: id },
          updateData,
          { new: true, runValidators: true }
        );
  
        res.status(200).json({ message: 'Hotel updated successfully', hotel: updatedHotel });
      } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: 'Error updating hotel', error: error.message });
      }
    }
  
    static async deleteHotel(req, res) {
      try {
        const { id } = req.params;
        const deletedHotel = await Hotel.findOneAndDelete({ _id: id });
  
        if (!deletedHotel) {
          return res.status(404).json({ message: 'Hotel not found' });
        }
  
        if (deletedHotel.hotel_image && deletedHotel.hotel_image.startsWith('/uploads/')) {
          const imagePath = path.join('public', deletedHotel.hotel_image);
          if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }
  
        res.status(200).json({ message: 'Hotel deleted successfully', hotel: deletedHotel });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting hotel', error: error.message });
      }
    }
  
    static async addPackageToHotel(req, res) {
      try {
        const { id } = req.params;
        const newPackage = req.body;
  
        // Validate the new package
        if (!newPackage.no_of_rooms || newPackage.no_of_rooms < 1) {
          return res.status(400).json({ message: 'Package must have at least 1 room' });
        }
  
        const hotel = await Hotel.findOne({ hotel_id: id });
        if (!hotel) {
          return res.status(404).json({ message: 'Hotel not found' });
        }
  
        hotel.hotel_packages.push(newPackage);
        await hotel.save();
  
        res.status(200).json({ message: 'Package added successfully', hotel });
      } catch (error) {
        res.status(500).json({ message: 'Error adding package', error: error.message });
      }
    }
  
    static async removePackageFromHotel(req, res) {
      try {
        const { id, packageId } = req.params;
  
        const hotel = await Hotel.findOne({ hotel_id: id });
        if (!hotel) {
          return res.status(404).json({ message: 'Hotel not found' });
        }
  
        hotel.hotel_packages = hotel.hotel_packages.filter(
          (pkg) => pkg._id.toString() !== packageId
        );
  
        await hotel.save();
        res.status(200).json({ message: 'Package removed successfully', hotel });
      } catch (error) {
        res.status(500).json({ message: 'Error removing package', error: error.message });
      }
    }
  
    static async uploadImage(req, res) {
      try {
        if (!req.file) {
          return res.status(400).json({ message: 'No image file provided' });
        }
  
        const imageUrl = `/uploads/hotels/${req.file.filename}`;
        res.status(200).json({ imageUrl });
      } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: 'Error uploading image', error: error.message });
      }
    }
  

  // Get all hotels
  static async getAllHotels(req, res) {
    try {
      const hotels = await Hotel.find();
      res.status(200).json({ hotels });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching hotels', error: error.message });
    }
  }

  // Get a single hotel by ID
  static async getHotelById(req, res) {
    try {
      const { id } = req.params;
      const hotel = await Hotel.findOne({ _id: id });

      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      res.status(200).json({ hotel });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching hotel', error: error.message });
    }
  }

  // Update a hotel by ID
  static async updateHotel(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      // Find the hotel before updating
      const hotel = await Hotel.findOne({ _id: id });
      if (!hotel) {
        // If file was uploaded, delete it since we're not updating
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({ message: 'Hotel not found' });
      }

      // Handle the hotel image (either from file upload or URL)
      if (req.file) {
        // Create URL path for the uploaded image
        updateData.hotel_image = `/uploads/hotels/${req.file.filename}`;
        
        // Delete the old image file if it exists and is not a URL
        if (hotel.hotel_image && hotel.hotel_image.startsWith('/uploads/')) {
          const oldImagePath = path.join('public', hotel.hotel_image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      // Parse hotel_packages if it's a string
      if (typeof updateData.hotel_packages === 'string') {
        updateData.hotel_packages = JSON.parse(updateData.hotel_packages);
      }

      // Find and update the hotel
      const updatedHotel = await Hotel.findOneAndUpdate({ _id: id }, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Validate the update data
      });

      res.status(200).json({ message: 'Hotel updated successfully', hotel: updatedHotel });
    } catch (error) {
      // If file was uploaded, delete it on error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ message: 'Error updating hotel', error: error.message });
    }
  }

  // Delete a hotel by ID
  static async deleteHotel(req, res) {
    try {
      const { id } = req.params;
      const deletedHotel = await Hotel.findOneAndDelete({ _id: id });

      if (!deletedHotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      // Delete the hotel image file if it exists and is not a URL
      if (deletedHotel.hotel_image && deletedHotel.hotel_image.startsWith('/uploads/')) {
        const imagePath = path.join('public', deletedHotel.hotel_image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      res.status(200).json({ message: 'Hotel deleted successfully', hotel: deletedHotel });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting hotel', error: error.message });
    }
  }

  // Add a package to a hotel
  static async addPackageToHotel(req, res) {
    try {
      const { id } = req.params;
      const newPackage = req.body;

      // Validate the new package
      if (!newPackage.no_of_rooms || newPackage.no_of_rooms < 1) {
        return res.status(400).json({ message: 'Package must have at least 1 room' });
      }

      const hotel = await Hotel.findOne({ hotel_id: id });
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      hotel.hotel_packages.push(newPackage);
      await hotel.save();

      res.status(200).json({ message: 'Package added successfully', hotel });
    } catch (error) {
      res.status(500).json({ message: 'Error adding package', error: error.message });
    }
  }


  // Remove a package from a hotel
  static async removePackageFromHotel(req, res) {
    try {
      const { id, packageId } = req.params;

      // Find the hotel and remove the package
      const hotel = await Hotel.findOne({ hotel_id: id });
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      // Filter out the package to remove
      hotel.hotel_packages = hotel.hotel_packages.filter(
        (pkg) => pkg._id.toString() !== packageId
      );

      await hotel.save();

      res.status(200).json({ message: 'Package removed successfully', hotel });
    } catch (error) {
      res.status(500).json({ message: 'Error removing package', error: error.message });
    }
  }

    // Handle image upload
    static async uploadImage(req, res) {
      try {
        // Check if a file was uploaded
        if (!req.file) {
          return res.status(400).json({ message: 'No image file provided' });
        }
  
        // Create the URL for the uploaded image
        const imageUrl = `/uploads/hotels/${req.file.filename}`;
  
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
  
module.exports = HotelController;