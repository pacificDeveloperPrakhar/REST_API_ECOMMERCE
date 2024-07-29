const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    // User's first name
    first_name: {
      type: String,
      required: [true, 'missing the first name'], // Custom error message if not provided
    },
    // User's last name
    last_name: {
      type: String,
    },
    // User's email, must be unique
    email: {
      type: String,
      required: [true, 'missing the email address'], // Custom error message if not provided
      unique: true,   // Ensures email is unique across all users
    },
    // User's password
    password: {
      type: String,
      required: [true, 'missing the password'], // Custom error message if not provided
    },
    // Confirmation of the password
    confirmPassword: {
      type: String,
      required: [true, 'missing the password confirmation'], // Custom error message if not provided
    },
    // Date when the user created the profile
    createdAt: {
      type: Date,
      required: [true, "missing the date parameter at which the user created the profile"], // Custom error message if not provided
    },
    // Modification details
    modification: {
      modifiedAt: {
        type: Date,
        default: Date.now, 
      },
      logs: [
        {
          modifiedAt: {
            type: Date,
            default: Date.now, // Default to current date
          },
          description: {
            type: String,
             
          },
        },
      ],
    },
    // Verification details
    verification_details: {
      isVerified: {
        type: Boolean,
        default: false,
        required: [true, 'profile document is missing the isVerified flag'], // Custom error message if not provided
      },
      verification_factor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VerificationFactor",
        default: null, 
      },
    },
    // Role details
    role_details: {
      role: {
        type: [String],
        enum: ['consumer', 'distributor', 'admin', 'maintenance', 'service'], // Define the enum values
        required: [true, 'missing the role'], // Custom error message if not provided
        default: ['consumer'],
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
    },
    // List of products related to the user
    products: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Product',
      default: [],
    },
    // User's profile images
    images: {
      iconURL: {
        type: String,
        required: false,
      },
      imageURL: {
        type: [String],
      },
    },
    address:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Location'
    },
    reviews:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Review"
    }
  },
  {
    timestamps: true, 
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
  }
);

// Create and export the User model
module.exports = mongoose.model('Profile', UserSchema);
