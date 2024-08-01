const profiles = require("../models/profile");
const User = require("../models/profile");
const jwt = require("jsonwebtoken");
const appError=require("../utils/appErrors")
const AppError=require("../utils/appErrors")
const catchAsync = require("../utils/catchAsync");

const privateKey = process.env.SECRET_KEY

exports.signup = catchAsync(async function (req, res, next) {
    const { first_name, email, password, confirmPassword } = req.body;
  
    // Generate JWT token
    const token = jwt.sign({ email, first_name }, privateKey);
  
    // Create a new profile
    const profile = await profiles.create({ first_name, email, password, confirmPassword });
  
    // Set the token as a cookie
      res.cookie('jwt', token, {
      httpOnly: false, // Cookie is not accessible via JavaScript
      secure: false, // Set to true in production (HTTPS only)
      sameSite: 'strict', // CSRF protection
      maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration (30 days)
    });
    
    // Set the token in the Authorization header
    res.setHeader('Authorization', `Bearer ${token}`);
    // token has been stored to the session storage
    req.session.token=token
    // Respond with the profile data
    res.status(201).json({
      status: 'success',
      data: {
        profile,
      },
    });
  });
  
// login feature
exports.login = catchAsync(async function (req, res, next) {
    const { email, password } = req.body;
  
    // Check if the email and password are provided
    if (!email) return next(new appError("Email parameter is missing", 400));
    if (!password) return next(new appError("Password parameter is missing", 400));
    
    // Find the user profile by email
    const profileDoc = await profiles.findOne({ email });
    
    // Check if the profile exists and the password is correct
    if (!profileDoc || !(await profileDoc.comparePassword(password))) {
      return next(new appError('Invalid email or password', 401));
    }
    
    // Generate JWT token
    const token = jwt.sign({ email }, privateKey);
    
    // Set the token as a cookie
    res.cookie('jwt', token, {
      httpOnly: false, // Cookie is not accessible via JavaScript
      secure: false, // Set to true in production (HTTPS only)
      sameSite: 'strict', // CSRF protection
      maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration (30 days)
    });
    
    // Set the token in the Authorization header
    res.setHeader('Authorization', `Bearer ${token}`);
    // token has been stored to the session store
    req.session.token=token
    // Respond with the profile data
    res.status(200).json({
      status: 'success',
      data: {
        profile: profileDoc,
      },
    });
  });
  
  //to authenticate the request comming
  
  exports.authenticateRequest = catchAsync(async (req, res, next) => {
    // Step 1: Check for token in the Authorization header
    let token = null;
    const authHeader = req.headers['authorization'];
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract the token from the header
      token = authHeader.split(' ')[1];
    } else {
      // Check for token in cookies if not found in the header
      token = req.cookies?.authToken || null;
    }
    
    // Check for token in the session if not found in the header or cookies
    if (!token && req.session.token) {
      token = req.session.token;
    }
  
    // If no token is found, return an error
    if (!token) {
      return next(new appError("No token was found", 403));
    }
    
    // Step 2: Decode and verify the token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, privateKey); // Use jwt.verify to verify the token
      if (!decodedToken) {
        return next(new appError("Failed to decode token", 401));
      }
    } catch (err) {
      return next(new appError("Invalid token format", 401));
    }
  
    // Attach decoded token to the request object for further use
    req.user = decodedToken;
  
    // Proceed to the next middleware or route handler
    next();
  });
  

// controller to authenticate if the user navigates to the forget password
exports.authenticateWithToken=catchAsync(async function(req,res,next){
    const {email}=req.body;
    const profileDoc=await profiles.findOne({email});
    if(!profileDoc)
        return next(new appError("no email exists in the database or registered",400))
    const token=await profileDoc.createResetPasswordToken()
    console.log(`password forget has been acessed :${token}`)
    await profileDoc.save({ validateBeforeSave: false });
    //send the token using email or anything specified
    req.body.from=process.env.gmail||req.body.from
    req.body.text=`verification otp has been sent to ${req.body.to},your otp is :${token}`
    req.body.subject=`verification token:${token}`
    req.body.to=email
    next()

})

// resetting password controller
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email, token, newPassword, confirmPassword } = req.body;

  // Check if all required fields are provided
  if (!email || !token || !newPassword || !confirmPassword) {
    return next(new AppError('Please provide email, token, new password, and confirm password', 400));
  }

  // Check if newPassword and confirmPassword match
  if (newPassword !== confirmPassword) {
    return next(new AppError('New password and confirm password do not match', 400));
  }

  // Find the user by email
  const user = await User.findOne({ email }).select('+passwordResetToken +passwordResetExpires');

  // Check if user exists
  if (!user) {
    return next(new AppError('There is no user with that email', 404));
  }

  // Check if the token is valid and not expired
  const isTokenValid = user.compareResetToken(token);
  const isTokenExpired = user.passwordResetExpires < Date.now();

  if (!isTokenValid || isTokenExpired) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // Token is valid and not expired, proceed with updating the password
  user.password = newPassword;
  user.confirmPassword=confirmPassword
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password has been reset successfully'
  });
});
