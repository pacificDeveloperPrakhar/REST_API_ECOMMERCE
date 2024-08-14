const profiles = require("../models/profile");
const User = require("../models/profile");
const jwt = require("jsonwebtoken");
const appError=require("../utils/appErrors")
const AppError=require("../utils/appErrors")
const verification=require("../models/verification_factor")
const catchAsync = require("../utils/catchAsync");
const verification_factor = require("../models/verification_factor");
const { response } = require("express");
const privateKey = process.env.SECRET_KEY

exports.signup = catchAsync(async function (req, res, next) {
    const { first_name, email, password, confirmPassword } = req.body;
  
    // Generate JWT token
    const token = jwt.sign({ email, first_name }, privateKey);
    // if the profile exists then remove it
    await profiles.findOneAndDelete({email})
    // Create a new profile
    const profile = await profiles.create({ first_name, email, password, confirmPassword });
    // preparing the data for the next middleware
    req.profile=profile
    req.token=token
    req.isSignup=true
    req.session.userId=profile._id
    next()
  });
// issuing token and storing that inside the session storage
exports.issueToken=catchAsync(async function(req,res,next){
      // Set the token as a cookie
      res.cookie('jwt', req.token, {
        httpOnly: false, // Cookie is not accessible via JavaScript
        secure: false, // Set to true in production (HTTPS only)
        sameSite: 'strict', // CSRF protection
        maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration (30 days)
      });
      
      // Set the token in the Authorization header
      res.setHeader('Authorization', `Bearer ${req.token}`);
      // token has been stored to the session storage
      req.session.token=req.token
      // send the response

      res.status(req.status||201).json({
        status:"ok",
        data:{
          profile:req.profile
        }
      })
      
})
  
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
     req.token=token;
     req.profile=profile;
     req.status=200
     next()
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
    if(req?.session?.passport?.user?.token)
      token=req.session.passport.user.token
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

exports.tokenGenerator=catchAsync(async function(req,res,next){
  const {email}=req.body  
  const profile=email?await profiles.findOne({email}):await profiles.findById(req.user._id||req.session.userId)
  if(!profile)
    return next(new appError("no profile with the email was prior registered ",400))
  console.log(profile)
  const tokenString=await profile.createResetPasswordToken()
  const payload={
    email:profile.email,
    token:tokenString
  }
  const token = jwt.sign(payload, privateKey, { expiresIn: '1h' });
  //disabling all the verification objects previously issued
  const verificationObjs=await verification.find({profileID:profile._id})
  await Promise.all(verificationObjs.map(async (obj)=>{
    obj.isValid=false;
    obj.isUsed=false;
    await obj.save()
  }))
  const verification_obj=await verification.create({profileID:profile._id,value:token})
  profile.verification_details.verification_factor=verification_obj._id
  await profiles.findByIdAndUpdate(profile._id,profile)
  //extracting the parent url route and making it ready to be send for the verification process
  const root = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const parentRoute=(root.split('/').slice(0,root.split('/').length-1).join('/'))
  let redirectUri
  if(req.isSignup)
    redirectUri=`${parentRoute}/signup/${verification_obj._id}`
  else
    redirectUri=`${parentRoute}/verifyProfile/${verification_obj._id}`

  //now defining the sender,subject and its reciever for the verification
  req.body.to=email;
  req.body.from="prakharvision@gmail.com"
  req.body.subject=`to verify your email or reset password follow this link ${redirectUri}`
  req.body.url=redirectUri
  next()
})

exports.authenticateVerification=catchAsync(async function(req,res,next){
  const {verifyId}=req.params;
  const verification_obj=await verification_factor.findById(verifyId)
  if(!verification_obj)
    return next(new appError("verification time has either been expired or new verification token was issued",400))
  const profile=await profiles.findOne({_id:verification_obj.profileID}).select("passwordResetToken")
  if(!profile)
    return next(new appError("profile associated with this verification has been deleted from the database"))
  //check if the token has not been tampered it is somewhat not useful yet i did it anyways as the token was comming from the database
  if(! jwt.verify(verification_obj.value,privateKey))
    return next(new appError("invalid jwt token",403))
  const {email,token}=jwt.decode(verification_obj.value,privateKey)
  if(! await profile.compareResetToken(token))
    return next(new appError("token is invalid",403))
  profile.verification_details.isVerified=true
  await profiles.findByIdAndUpdate(profile._id,profile)
  // ------------------------------------------------------------------------------------------
  // making the request ready for the following middleware this is in case of the verification of the email
  const {first_name}=profile
  req.profile=profile;
  req.token=jwt.sign({ email, first_name }, privateKey);
  next()
})
exports.isEmailVerified=catchAsync(async function(req,res,next){
  const profile=profiles.find
})

exports.signiningUpAsAdmin=catchAsync(function(req,res,next){

})