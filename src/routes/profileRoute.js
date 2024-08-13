const express=require("express")
const {getAllProfiles,createProfile,getProfileById,deleteProfile,updateProfile,updateTheCurrentlySessionedProfile}=require("../controllers/profileController.js")
const {signup,login}=require('../controllers/authControllers.js')
const {authenticateRequest,authenticateWithToken,resetPassword,tokenGenerator,authenticateVerification,issueToken}=require("../controllers/authControllers.js")
const {sendMail}=require("../controllers/communicationController.js")
const passport = require("passport")
const {uploadCloudinary,uploadLocal, storeToCloudinary}=require("../utils/multerConfig.js")
const router=express.Router();
router.route("/signup").post(signup,tokenGenerator,sendMail).get(authenticateVerification,issueToken)
router.route("/signup/:verifyId").get(authenticateVerification,issueToken)
router.route("/forgetPassword").post(authenticateWithToken,sendMail)
router.route("/login").post(login,issueToken)
router.route("/redirect").get(passport.authenticate('google'),(req,res)=>{
    res.send("done authenticting with the google")
})
router.route("/authWithGoogle").get(passport.authenticate("google",{
    scope:["email","profile"]
}),(req,res)=>{
    res.send("redirecting to google for the authenticating")
})
router.route("/resetPassword").post(resetPassword)
router.route("/uploadCurrentlySessionedProfile").post((req,res,next)=>{req.typeMime=["images"];req.folder='profiles';next()},uploadLocal.array("images",6),storeToCloudinary,updateTheCurrentlySessionedProfile)
router.route('/:id').get(getProfileById).delete(deleteProfile).patch(updateProfile)
router.route('/').get(authenticateRequest,getAllProfiles).post(createProfile)

module.exports=router