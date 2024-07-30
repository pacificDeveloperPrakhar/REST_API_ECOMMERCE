const profiles = require("../models/profile");
const jwt = require("jsonwebtoken");
const appError=require("../utils/appErrors")
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
    console.log("log")
    // Step 1: Check for token in the Authorization header
    let token = null;
    const authHeader = req.headers['authorization'];
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // Extract the token from the header
        console.log("log")
        token = authHeader.split(' ')[1];
    } else {
        // Check for token in cookies if not found in the header
        token = req.cookies.authToken || null;
    }
    
    if (!token) {
        return next(new appError("No token was found", 403));
    }
    
    // Step 2: Decode and verify the token
    let decodedToken;
    try {
        console.log("log")
        decodedToken = jwt.decode(token);
        if (!decodedToken) {
            return next(new appError("Failed to decode token", 401));
        }
  } catch (err) {
    return next(new appError("Invalid token format", 401));
  }

  const { email } = decodedToken;
  
  const profileDoc = await profiles.findOne({ email });
  if (!profileDoc) {
    return next(new appError("The given profile does not exist or has been removed following the issuance of the token", 401));
  }

  try {
    jwt.verify(token, privateKey);
  } catch (err) {
    return next(new appError("Token is invalid, issue a new one", 401));
  }

  // Attach the token to the request object
  req.token = token;
  
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

})