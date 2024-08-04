const Express = require("express");
const productRoute=require('./routes/productRoute')
const profileRoute=require("./routes/profileRoute.js")
const cookie_parser=require("cookie-parser")
const developmentRoute=require("./routes/developmentRoute.js")
const utils=require("util")
const passport = require('passport');
const appError=require("./utils/appErrors")
const session = require('express-session');
const MongoStore = require('connect-mongo');
const {LocalStrategy}=require("./controllers/thirdpartyAuthControllers")
const {colorRed,colorReset}=require("./utils/color_codes");
const { GoogleStrategy } = require("./controllers/thirdpartyAuthControllers.js");
const app = Express();
//
//here is the session middleware
//
// Set up session middleware with MongoDB store
app.use(session({
  secret: process.env.SESSION_SECRET, // Replace with a strong secret key
  resave: true,                      // Do not resave session if unmodified
  saveUninitialized: true,           // Do not create session until something is stored
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,  // MongoDB connection URL
    collectionName: 'sessions',        // Custom collection name
    ttl: 14 * 24 * 60 * 60,           // Session expiration time in seconds (14 days)
    autoRemove: 'native'              // Automatically remove expired sessions
  }),
  cookie: {
    secure: false,                    // Set to true if using HTTPS
    maxAge: 14 * 24 * 60 * 60 * 1000  // Cookie expiration time (14 days)
  }
}));
//
//
//initializing passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(LocalStrategy)
passport.use(GoogleStrategy)
//

//
// demonstrating the session creation
app.use((req,res,next)=>{
  
  if(req.session.visitCount)
    req.session.visitCount++;
  else
    req.session.visitCount=1
  req.session.save((err) => {
    if (err) {
      next(err)
    }
    next()
})
})
//
app.use(Express.json({ limit: "30kb" }));
app.use('/api/v1/develop',developmentRoute)
app.use('/api/v1/profiles',profileRoute);
app.use('/api/v1/products',productRoute);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      error: {
        message: err.message
      }
    });
  });
  app.all('*', (req, res, next) => {
   const err=new appError(`${req.originalUrl} was not found`,404)
   next(err)
  });
  app.use((err,req,res,next)=>{
    console.log("________________________________________________________________________________________")
    console.log(`${colorRed}${err?.stack}${colorReset}`)
    err.statusCode=err["status code"]||500;
    err.status=err.status||"action failed due to internal server error"
    res.status(500).json({
      status:err.status,
      "status code":err.statusCode,
      message:err.message,
      
    })
  })
module.exports=app