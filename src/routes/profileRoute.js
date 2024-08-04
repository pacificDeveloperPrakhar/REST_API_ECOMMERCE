const express=require("express")
const {getAllProfiles,createProfile,getProfileById,deleteProfile,updateProfile}=require("../controllers/profileController")
const {signup,login}=require('../controllers/authControllers')
const {authenticateRequest,authenticateWithToken,resetPassword}=require("../controllers/authControllers.js")
const {sendMail}=require("../controllers/communicationController.js")
const {uploadCloudinary,uploadLocal, storeToCloudinary}=require("../utils/multerConfig.js")
const router=express.Router();
router.route("/signup").post(signup)
router.route("/forgetPassword").post(authenticateWithToken,sendMail)
router.route("/login").post(login)
router.route('/:id').get(getProfileById).delete(deleteProfile).patch(updateProfile)
router.route("/resetPassword").post(resetPassword)
router.route("/uploadCurrentlySessionedProfile").post((req,res,next)=>{req.typeMime=["images"];next()},uploadLocal.array("images",6),storeToCloudinary,(req,res)=>{
    console.log(req.fileObjs)
})
router.route('/').get(authenticateRequest,getAllProfiles).post(createProfile)

module.exports=router