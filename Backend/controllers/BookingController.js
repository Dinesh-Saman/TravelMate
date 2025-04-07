const Booking = require('../models/bookingModel');
const Hotel = require('../models/hotelModel');

class BookingController {
  static async createBooking(req, res) {
    try {
      const {
        booking_id,
        user_name,
        hotel_name,
        package: packageName,
        price,
        no_of_rooms,
        booking_from,
        booking_to,
        card_type,
        card_number,
        cvv,
        card_validity,
        amount
      } = req.body;

      // Check if booking_id already exists
      const existingBooking = await Booking.findOne({ booking_id });
      if (existingBooking) {
        return res.status(400).json({ message: 'Booking with this ID already exists' });
      }

      // Validate booking dates
      if (new Date(booking_to) <= new Date(booking_from)) {
        return res.status(400).json({ message: 'Booking end date must be after start date' });
      }

      // Validate card validity
      if (new Date(card_validity) <= new Date()) {
        return res.status(400).json({ message: 'Card has expired' });
      }

      // Check if hotel exists
      const hotel = await Hotel.findOne({ hotel_name });
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      // Check if package exists in the hotel
      const hotelPackage = hotel.hotel_packages.find(pkg => pkg.package_name === packageName);
      if (!hotelPackage) {
        return res.status(404).json({ message: 'Package not found in the specified hotel' });
      }

      // Validate room availability
      if (no_of_rooms > hotelPackage.no_of_rooms) {
        return res.status(400).json({ message: 'Not enough rooms available in this package' });
      }

      const newBooking = new Booking({
        booking_id,
        user_name,
        hotel_name,
        package: packageName,
        price,
        no_of_rooms,
        booking_from: new Date(booking_from),
        booking_to: new Date(booking_to),
        payment: {
          card_type,
          card_number,
          cvv,
          card_validity: new Date(card_validity),
          amount
        },
        status: 'confirmed'
      });

      await newBooking.save();

      // Update hotel package room availability
      hotelPackage.no_of_rooms -= no_of_rooms;
      await hotel.save();

      res.status(201).json({ 
        message: 'Booking created successfully', 
        booking: newBooking 
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ 
        message: 'Error creating booking', 
        error: error.message 
      });
    }
  }

  static async getAllBookings(req, res) {
    try {
      const { status } = req.query;
      const filter = {};
      
      if (status) {
        filter.status = status;
      }

      const bookings = await Booking.find(filter);
      res.status(200).json({ bookings });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching bookings', 
        error: error.message 
      });
    }
  }

  static async getBookingById(req, res) {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({ booking_id: id });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      res.status(200).json({ booking });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching booking', 
        error: error.message 
      });
    }
  }

  static async getUserBookings(req, res) {
    try {
      const { username } = req.params;
      const { status } = req.query;
      const filter = { user_name: username };
      
      if (status) {
        filter.status = status;
      }

      const bookings = await Booking.find(filter);

      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ 
          message: 'No bookings found for this user' 
        });
      }

      res.status(200).json({ bookings });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching user bookings', 
        error: error.message 
      });
    }
  }

  static async updateBooking(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Validate booking dates if both are provided
      if (updateData.booking_from && updateData.booking_to) {
        if (new Date(updateData.booking_to) <= new Date(updateData.booking_from)) {
          return res.status(400).json({ 
            message: 'Booking end date must be after start date' 
          });
        }
      }

      // Validate card validity if provided
      if (updateData.card_validity) {
        if (new Date(updateData.card_validity) <= new Date()) {
          return res.status(400).json({ 
            message: 'Card has expired' 
          });
        }
      }

      const updatedBooking = await Booking.findOneAndUpdate(
        { booking_id: id },
        updateData,
        { 
          new: true, 
          runValidators: true 
        }
      );

      if (!updatedBooking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      res.status(200).json({ 
        message: 'Booking updated successfully', 
        booking: updatedBooking 
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error updating booking', 
        error: error.message 
      });
    }
  }

  static async cancelBooking(req, res) {
    try {
      const { id } = req.params;

      const booking = await Booking.findOne({ booking_id: id });
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Find the hotel and package to restore room availability
      const hotel = await Hotel.findOne({ hotel_name: booking.hotel_name });
      if (hotel) {
        const hotelPackage = hotel.hotel_packages.find(
          pkg => pkg.package_name === booking.package
        );
        if (hotelPackage) {
          hotelPackage.no_of_rooms += booking.no_of_rooms;
          await hotel.save();
        }
      }

      // Update status to cancelled instead of deleting
      const cancelledBooking = await Booking.findOneAndUpdate(
        { booking_id: id },
        { status: 'cancelled' },
        { new: true }
      );

      res.status(200).json({ 
        message: 'Booking cancelled successfully',
        booking: cancelledBooking
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error cancelling booking', 
        error: error.message 
      });
    }
  }

  static async getBookingsByHotel(req, res) {
    try {
      const { hotelName } = req.params;
      const { status } = req.query;
      const filter = { hotel_name: hotelName };
      
      if (status) {
        filter.status = status;
      }

      const bookings = await Booking.find(filter);

      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ 
          message: 'No bookings found for this hotel' 
        });
      }

      res.status(200).json({ bookings });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching hotel bookings', 
        error: error.message 
      });
    }
  }
}

module.exports = BookingController;