const mongoose = require("mongoose");
const {isEmail}=require("validator")
const appError=require("../utils/appErrors")
const bcrypt=require("bcrypt")

const UserSchema = new mongoose.Schema(
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
      validate:{
        validator:function(value){
          return isEmail(value)
        }
      }
    },
    // User's password
    password: {
      type: String,
      required: [true, 'missing the password'], // Custom error message if not provided
      minLength:[6,'password should be minimum of 6 length long']
    },
    // Confirmation of the password
    confirmPassword: {
      type: String,
      required: [true, 'missing the password confirmation'], // Custom error message if not provided
      validate:{
        validator:function(value){
          return value==this.password
        },
        message:"confirmation password should be same as the above password"
      }
    },
    // Date when the user created the profile
    createdAt: {
      type: Date,
      default:Date.now,
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
//
//hashing the password
//
//
UserSchema.pre('save', async function(next) {
  // Hash password if it has been modified or if it's a new document
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(12); // Generate a salt with 12 rounds
      this.password = await bcrypt.hash(this.password, salt); // Hash the password
      this.confirmPassword = undefined; // Optionally remove the confirmPassword field
      next();
    } catch (err) {
      error=new appError("unable to hash the password",500)
      next(error); // Pass any errors to the next middleware
    }
  } else {
    next(); // If password has not been modified, continue to save
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
//
//
// Create and export the User model
const profiles =mongoose.models.Profile || mongoose.model('Profile', UserSchema);
module.exports=profiles