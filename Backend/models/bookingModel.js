const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  booking_id: {
    type: String,
    required: true,
    unique: true, // Ensure booking_id is unique
  },
  user_name: {
    type: String,
    required: true,
  },
  hotel_name: {
    type: String,
    required: true,
  },
  package: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Price shouldn't be negative
  },
  no_of_rooms: {
    type: Number,
    required: true,
    min: 0, // At least 1 room needed
  },
  booking_from: {
    type: Date,
    required: true,
  },
  booking_to: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        // Ensure booking_to is after booking_from
        return value > this.booking_from;
      },
      message: 'Booking end date must be after start date'
    }
  },
  payment: {
    card_type: {
      type: String,
      required: true,
      enum: ['Visa', 'MasterCard', 'American Express', 'Discover'] // Common card types
    },
    card_number: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          // Basic card number validation (13-19 digits)
          return /^[0-9]{13,19}$/.test(v);
        },
        message: props => `${props.value} is not a valid card number!`
      }
    },
    cvv: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          // CVV should be 3 or 4 digits
          return /^[0-9]{3,4}$/.test(v);
        },
        message: props => `${props.value} is not a valid CVV!`
      }
    },
    card_validity: {
      type: Date,
      required: true,
      validate: {
        validator: function(value) {
          // Ensure card is not expired
          return value > new Date();
        },
        message: 'Card has expired or invalid expiration date'
      }
    },
    amount: {
      type: Number,
      required: true,
      min: 0 // Amount shouldn't be negative
    }
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Add index for faster lookup by booking_id
bookingSchema.index({ booking_id: 1 });

// Add index for common queries
bookingSchema.index({ user_name: 1 });
bookingSchema.index({ hotel_name: 1 });
bookingSchema.index({ status: 1 }); // Index for status field

module.exports = mongoose.model('Booking', bookingSchema);