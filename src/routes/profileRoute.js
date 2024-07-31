const express=require("express")
const {getAllProfiles,createProfile,getProfileById,deleteProfile,updateProfile}=require("../controllers/profileController")
const {signup,login}=require('../controllers/authControllers')
const {authenticateRequest,authenticateWithToken,resetPassword}=require("../controllers/authControllers.js")
const {sendMail}=require("../controllers/developmentController.js")
const router=express.Router();
router.route("/signup").post(signup)
router.route("/forgetPassword").post(authenticateWithToken,sendMail)
router.route("/login").post(login)
router.route('/:id').get(getProfileById).delete(deleteProfile).patch(updateProfile)
router.route("/resetPassword").post(resetPassword)
router.route('/').get(authenticateRequest,getAllProfiles).post(createProfile)

module.exports=router