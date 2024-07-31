const express=require("express")
const {sendWhatsappMssg,sendSMS,sendMail,sendMailt}=require("../controllers/communicationController")
const router=express.Router()
router.route('/sms').get(sendSMS)
router.route('/wassup').get(sendWhatsappMssg)
router.route('/mail').post(sendMail)
router.route('/authenticateWithSession').post()
module.exports=router