const express=require("express")
const {sendWhatsappMssg,sendSMS,sendMail,sendMailt}=require("../controllers/developmentController")
const router=express.Router()
router.route('/sms').get(sendSMS)
router.route('/wassup').get(sendWhatsappMssg)
router.route('/mail').post(sendMail)
module.exports=router