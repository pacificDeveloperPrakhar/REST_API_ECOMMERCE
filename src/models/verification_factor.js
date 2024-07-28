const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VerificationFactorSchema = new Schema(
  {
    // Reference to the Profile collection
    profileID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: [true, 'must contain a reference to the profile'], // Custom error message if not provided
    },
    // OTP code generated
    value: {
      type: String,
      required: [true, 'must contain an OTP code generated'], // Custom error message if not provided
    },
    // Date when the OTP was created
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // Date when the OTP expires
    expiresAt: {
      type: Date,
      default: () => Date.now() + 10 * 60 * 1000, // Default expiration time set to 10 minutes from now
    },
    // Indicates if the OTP is still valid
    isValid: {
      type: Boolean,
      default: true,
    },
    // Indicates if the OTP has been used
    isUsed: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
  }
);

// Create and export the VerificationFactor model
module.exports = mongoose.model('VerificationFactor', VerificationFactorSchema);
