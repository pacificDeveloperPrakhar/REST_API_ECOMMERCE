const catchAsync=require("../utils/catchAsync")
const appErrors=require("../utils/appErrors")
const orderModel=require('../models/order.js')
const profileModel=require("../models/profile.js")
const cartModel=require("../models/cart.js")
// for now the checkout flow does not contains the checkout flow logic
exports.createOrders=catchAsync(async function(req,res,next){
  const userId=req.session.userId||req.user._id;
  // find the profile and if it not exists then raise the error
  const profile=await profileModel.findById(userId);
  if(!profile)
      return next(new appErrors("profile with this session stored user id is not found in the database",400))
  const cartDoc=await cartModel.findOne({user:userId})
  if(!cartDoc)
    return next(new appErrors("cart document associated with user profile was not found ",400))
  //check if the cart is empty then raise the error
  if(!cartDoc.cartItems.length)
  {
    return next(new appErrors("cart is empty , nothing to proceed with ",400))
  }
  
})