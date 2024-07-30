const express=require("express")
const {getAllProfiles,createProfile,getProfileById,deleteProfile,updateProfile}=require("../controllers/profileController")
const {signup,login}=require('../controllers/authControllers')
const {authenticateRequest,authenticateWithToken}=require("../controllers/authControllers.js")
const router=express.Router();
router.route("/signup").post(signup)
router.route("/forgetPassword").post(authenticateWithToken)
router.route("/login").post(login)
router.route('/:id').get(getProfileById).delete(deleteProfile).patch(updateProfile)
router.route('/').get(authenticateRequest,getAllProfiles).post(createProfile)

module.exports=router