const mongoose = require('mongoose');
const Product = require('../models/product.js');
const catchAsync = require('../utils/catchAsync.js');
const APIFeatures=require('../utils/APIFeatures.js')
const accountSid = 'AC0078078e84cd495b7f885c66c15218eb';
const authToken = 'a3a11fbfcca37998c8724f7b388cf02b';
const client = require('twilio')(accountSid, authToken);
exports.sendWhatsappMssg=catchAsync(async function(req,res,next){
   

const message=await client.messages
    .create({
        body: 'Your appointment is coming up on July 21 at 3PM',
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+917607277480'
    })
    console.log("message:",message)
})