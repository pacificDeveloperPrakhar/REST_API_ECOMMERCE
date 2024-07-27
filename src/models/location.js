const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new Schema(
  {
    // City of the location
    city: {
      type: String,
      required: [true, 'must contain a city for the location'], // Custom error message if not provided
    },
    // Country of the location
    country: {
      type: String,
      required: [true, 'must contain a country for the location'], // Custom error message if not provided
    },
    // Apartment number of the location
    apartmentNumber: {
      type: String,
      required: false,
    },
    // District of the location
    district: {
      type: String,
      required: false,
    },
    // Postal code of the location
    postalCode: {
      type: String,
      required: [true, 'must contain a postal code for the location'], // Custom error message if not provided
    },
    // GeoJSON object representing the location
    location: {
      type: {
        type: String,
        enum: ['Point'], // Only allow Point type for GeoJSON
        required: [true, 'must specify the type as Point'], // Custom error message if not provided
      },
      coordinates: {
        type: [Number],
        required: [true, 'must contain coordinates for the location'], // Custom error message if not provided
      }
    },
    // Date when the location was added
    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
  }
);

// Create a 2dsphere index on the location field
LocationSchema.index({ location: '2dsphere' });

// Create and export the Location model
module.exports = mongoose.model('Location', LocationSchema);
