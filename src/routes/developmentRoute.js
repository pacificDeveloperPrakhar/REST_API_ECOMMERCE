const express=require("express")
const {sendWhatsappMssg}=require("../controllers/developmentController")
const router=express.Router()
router.route('/sms',(req,res,next)=>{})
router.route('/wassup').get(sendWhatsappMssg)
module.exports=router