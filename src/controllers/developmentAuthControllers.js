const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/profile'); // Replace with your User model
const catchAsync = require('../utils/catchAsync'); // Your custom utility function
const appError = require('../utils/appErrors');
const profiles = require('../models/profile');
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
passport.serializeUser((user,done)=>{
    done(null,user.id)
})
passport.deserializeUser(async (id,done)=>{
    try{

        const user = await User.findById(id); // Retrieve user details from the database
        done(null, user);
    }
    catch(err){
        done(err)
    }
})
 module.exports=new LocalStrategy(customFIelds,loginThroughPassport)