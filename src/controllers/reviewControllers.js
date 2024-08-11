const Review = require("../models/Review");
const Product = require('../models/product');
const Profile = require("../models/profile");
const appError = require("../utils/appErrors");
const AppError = require("../utils/appErrors");
const catchAsync = require("../utils/catchAsync");

// Create a review
exports.addReview = catchAsync(async function(req, res, next) {
    const { message, rating } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product)
        return next(new AppError("No product has been found", 400));

    const userId = req?.user?._id || req.session.userId;
    const profile = await Profile.findById(userId);
    if (!profile)
        return next(new AppError("No profile has been found", 400));

    const review = await Review.create({
        message, 
        rating,
        product: product._id,
        user: profile._id,
    });

    profile.reviews.push(review._id);
    product.reviews.push(review._id);
try{

    await Profile.findByIdAndUpdate(userId,profile)
    await Product.findByIdAndUpdate(productId,product)
}
catch(err){
    return next(new appError(err.message,500))
}

    res.status(201).json({
        status: "done creating",
        data: review
    });
});

// Get a review by ID
exports.getReview = catchAsync(async function(req, res, next) {
    const { reviewId } = req.params;
    const reviewFound = await Review.findById(reviewId);
    
    if (!reviewFound) 
        return next(new AppError("No review has been found", 404));

    res.status(200).json({
        status: "ok",
        data: { review: reviewFound }
    });
});

// Update a review by ID
exports.updateReview = catchAsync(async function(req, res, next) {
    const { reviewId } = req.params;
    const { message, rating } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(reviewId, 
    { message, rating }, 
    { new: true, runValidators: true });

    if (!updatedReview) 
        return next(new AppError("No review has been found", 404));

    res.status(200).json({
        status: "ok",
        data: { review: updatedReview }
    });
});

// Delete a review by ID
exports.deleteReview = catchAsync(async function(req, res, next) {
    const { reviewId } = req.params;

    const reviewToDelete = await Review.findById(reviewId);
    
    if (!reviewToDelete) 
        return next(new AppError("No review has been found", 404));
    
    // Remove references from profile and product
    await Profile.updateOne({ _id: reviewToDelete.user }, { $pull: { reviews: reviewToDelete._id } });
    await Product.updateOne({ _id: reviewToDelete.product }, { $pull: { reviews: reviewToDelete._id } });
    
    const review= await Review.findByIdAndDelete(reviewId);
    res.status(204).json({
        status: "deleted",
        data: {
            review
        }
    });
});

// Get all reviews for a user's profile for a specific product
exports.currentProfileReview = catchAsync(async function(req, res, next) {
    const { productId } = req.params;
    if(!productId)
        next()
    const product = await Product.findById(productId);
    if (!product)
        return next(new AppError("No product has been found", 400));

    const userId = req?.user?._id || req.session.userId;
    
    const profile = await Profile.findById(userId);
    if (!profile)
        return next(new AppError("No profile has been found", 400));
    const reviewsFound = await Review.find({ user: userId, product: productId });
    
    res.status(200).json({
        status: "ok",
        length: reviewsFound.length,
        data: { reviews: reviewsFound }
    });
});

exports.getAllReviews=catchAsync(async function(req,res,next){
    const reviews=await Review.find();
    const length=reviews.length
    res.status(200).json({
        status:"ok",
        length,
        data:{
            reviews
        }
    })
})
exports.getCurrentProfileAllReviews=catchAsync(async function(req,res,next){
    const userId=req.user._id||req.session.userId;
    if(!userId)
        return next(new appError("no user id was found to fetch reviews",400))
    const reviews=await reviews.find({user:userId})
    res.status(200).json({
        status:'ok',
        length:reviews.length,
        data:{
            reviews
        }
    })
})