const express=require("express")
const {getAllProfiles,createProfile,getProfileById,deleteProfile,updateProfile}=require("../controllers/profileController")
const router=express.Router();
router.route('/:id').get(getProfileById).delete(deleteProfile).patch(updateProfile)
router.route('/').get(getAllProfiles).post(createProfile)

module.exports=router