const catchAsync=require("../utils/catchAsync")
const appErrors=require("../utils/appErrors")
const cartModel=require("../models/cart");
const profiles = require("../models/profile");
// controller to get all the carts 
exports.getAllCarts=catchAsync(async function(req,res,next){
    const carts = await cartModel.find()
 res.status(200).json({
   status: 'success',
   results: carts.length,
   data: {
     carts
   }
 });
})
//controller to remove a cart by its id
exports.deleteCart=catchAsync(async function(req,res,next){
    const {cartId}=req.params
    const cartObj=await cartModel.findByIdAndDelete(cartId)
    res.status(201).json({
        status: 'deleted',
        results: carts.length,
        data: {
          cartObj
        }
      });
})
// controller to get a cart by its id 
exports.getCart=catchAsync(async function(req,res,next){
    const {cartId}=req.params
    const cartObj=await cartModel.findById(cartId)
    res.status(200).json({
        status: 'success',
        data: {
          cartObj
        }
      });
})
// controller to get add into the cart or to create a new cart
// the cart will be created as soom as the new product will be added into the cart
//the cart wil receive the product to add as params and quantity as the raw json request
exports.addToTheCart=catchAsync(async function(req,res,next){
    const {productId}=req.params;
    const {quantity}=req.body;
    const userId=req.session.userId||req.user._id;
    // find the profile and if it not exists then raise the error
    const profile=await profiles.findById(userId);
    if(!profile)
        return next(new appErrors("profile with this session stored user id is not found in the database",403))
    // now get product and reduce its quantity in it document
    const product=await products.findById(productId);
    if(!product)
        return next(new appErrors(`no product has been found with id id:${productId}`,400))
    //now reduce the quantity in the product document
    product.stock.stockAvailabilityQty=product.stock.stockAvailabilityQty-quantity
    await product.save()
    try{

        let cartDoc=await cartModel.findOne({user:userId})
        if(!cartDoc)
            cartDoc=await cartModel.create({
        user:userId,
        cartItems:[{product:productId,quantity}]
    })
    else
    // logic if the cart already exists
{ const toExecute=true
    cartDoc.cartItems.forEach((obj)=>{
        if(obj.product==productId){
            obj.quantity=quantity+obj.quantity;
            toExecute=false
            return
        }
    });
    if(toExecute){
        cartDoc.cartItems.push({product:productId,quantity})
            toExecute=true
        }
    }
    cartDoc.recentlyModifiedAt=Date.now()
}
catch(err){
    product.stock.stockAvailabilityQty=product.stock.stockAvailabilityQty+quantity
    await product.save()
    throw err
}
})