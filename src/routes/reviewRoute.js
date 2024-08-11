const express=require("express")
const router=express.Router({mergeParams:true})
const reviewController=require('../controllers/reviewControllers')
router.route('/all').get(reviewController.getAllReviews)
router.route("/:reviewId").get(reviewController.getAllReviews).delete(reviewController.deleteReview).patch(reviewController.updateReview)
router.route("/").get(reviewController.currentProfileReview,reviewController.getCurrentProfileAllReviews).post(reviewController.addReview);
module.exports=router