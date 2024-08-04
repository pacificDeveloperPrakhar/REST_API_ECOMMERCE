const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/profile'); // Replace with your User model
const catchAsync = require('../utils/catchAsync'); // Your custom utility function
const appError = require('../utils/appErrors');
const profiles = require('../models/profile');
const jwt=require("jsonwebtoken")
const GoogleStrategy=require("passport-google-oauth20")
const customFIelds={
    usernameField:"email",
    passwordField:"password"
}
const loginThroughPassport=(async function(email,password,done){
    try{

        const profile=await profiles.findOne({email})
        if(!profile)
            return done(new appError(`no user with email ${email} was found`,400))
        if(!password)
            return done(new appError(`password field is missing`,400))
        if(!profile.comparePassword(password))
            return done(new appError(`password is incorrect`),403)
        return done(null,profile)
    }
    catch(err){
        done(err)
    }

})
passport.serializeUser((obj,done)=>{
    done(null,obj)
})
passport.deserializeUser(async ({id},done)=>{
    try{

        const user = await User.findById(id); // Retrieve user details from the database
        done(null, user);
    }
    catch(err){
        done(err)
    }
})

// autheticating with google controller


callback_google=async (accessToken, refreshToken, profile, done) => {
  try {
    // Extract email and verified status from the profile object
    const { value: email, verified } = profile?.emails?.[0] || {};

    // Check if the email is present and verified
    if (!email) {
      return done(new appError('Email not provided by GitHub', 400));
    }

    if (!verified) {
      return done(new appError('Email not verified', 400));
    }

    // Log email and verification status
    

    // Find the profile document by email
    let profileDoc = await profiles.findOne({ email });
    if (!profileDoc) {
      // Create a new profile document if it doesn't exist
      profileDoc = new profiles({
        email,
        verification_details: { isVerified: verified },
      });
      profileDoc = await profileDoc.save({ validateBeforeSave: false });
    }

    // Update the profile document with the latest information
    profileDoc = await profiles.findByIdAndUpdate(
      profileDoc.id,
      { email, verification_details: { isVerified: verified } },
      { new: true }
    );

    // Create a JWT token
    const token = jwt.sign(
      { id: profileDoc.id }, // Payload containing the user ID
      process.env.secret_key, // Secret key
      { expiresIn: process.env.expiresIn } // Token expiration time
    );


    // Pass the profile ID to the done callback
    done(null, {id:profileDoc.id,token});
  } catch (err) {
    // Handle any other errors
    done(new appError(err.message, 500));
  }
};

exports.GoogleStrategy=new GoogleStrategy({
    clientID: process.env.google_client_id,
    clientSecret: process.env.google_secret_client,
    callbackURL: process.env.google_redirect_after_auth
},callback_google)
 exports.LocalStrategy=new LocalStrategy(customFIelds,loginThroughPassport)