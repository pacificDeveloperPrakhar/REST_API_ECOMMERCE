const mongoose = require('mongoose');
const Product = require('../models/product.js');
const catchAsync = require('../utils/catchAsync.js');
const APIFeatures=require('../utils/APIFeatures.js')
const appError=require("../utils/appErrors.js")
const AppError=require("../utils/appErrors.js")
const nodemailer=require("nodemailer")
const authToken = process.env.twilio_auth
const twilio=require("twilio")
exports.sendWhatsappMssg = catchAsync(async (req, res, next) => {
    const { body,  to } = req.body;
    req.to='whatsapp'+req.to
    const from=req.body.from||process.twilio_wassup_no||'whatsapp:+14155238886'
    // Check for required fields and validate the phone number format
    if (!body || !from || !to || !/^whatsapp:\+\d+$/.test(from) || !/^whatsapp:\+\d+$/.test(to)) {
      return next(new AppError('Invalid or missing fields: body, from, or to (ensure they are WhatsApp numbers)', 400));
    }
  
    // Create and send WhatsApp message
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH);
    const message = await client.messages.create({
      body,
      from,
      to
    });
  
    console.log('Message sent:', message);
    res.status(200).json({
      status: 'success',
      message: req.mssg||`WhatsApp message has been sent to ${to}`
    });
  });
  
  // Send SMS
  exports.sendSMS = catchAsync(async (req, res, next) => {
    const { body, to } = req.body;
  const from=req.body.from||process.twilio_sms_no||'+15714493632'
    // Check for required fields and validate the phone number format
    if (!body || !from || !to || !/^\+\d+$/.test(from) || !/^\+\d+$/.test(to)) {
      return next(new AppError('Invalid or missing fields: body, from, or to (ensure they are valid phone numbers)', 400));
    }
  
    // Create and send SMS
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH);
    const message = await client.messages.create({
      body,
      from,
      to
    });
  
    console.log('Message SID:', message.sid);
    res.status(200).json({
      status: 'success',
      message: `SMS has been sent to ${to}`
    });
  });
  
  // Send Gmail
  exports.sendGMail = catchAsync(async (req, res, next) => {
  
    // Check for required fields
    if (!to || !subject || !text) {
      return next(new AppError('Missing required fields: to, subject, or text', 400));
    }
  
    // Create and send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      port: 465,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSWORD_GMAIL
      }
    });
  
    const mailOptions = {
      from: process.env.GMAIL,
      to,
      subject,
      text
    };
  
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return next(new AppError('Failed to send email', 500));
      }
  
      console.log('Email sent:', info.response);
      res.status(200).json({
        status: 'success',
        message: `Email has been sent to ${to}`
      });
    });
  });
  const fs = require('fs');
  const path = require('path');
  
  // Your sendMail function
  exports.sendMail = catchAsync(async (req, res, next) => {
    // Check for required fields and throw an error if they are missing
    console.log(req.body);
    if (!req.body.to || !req.body.from || !req.body.subject || !req.body.url) {
      return next(new AppError('Missing required fields: to, from, subject, or URL', 400));
    }
  
    // Read the email template from a file
    const filePath = path.join(__dirname,"../","../", 'public','emailView.html'); // Adjust the file path as needed
    let emailContent = fs.readFileSync(filePath, 'utf-8');
  
    // Replace the placeholder %URL% with the actual URL from req.body.url
    emailContent = emailContent.replace(/%URL%/g, req.body.url);
  
    // Create a transporter object using the Mailtrap service
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "0347f91a78020d",
        pass: process.env.mailtrap_pass // Replace with your Mailtrap password
      }
    });
  
    // Define the email options with the modified HTML content
    const mailOptions = {
      from: req.body.from, // Sender address
      to: req.body.to, // List of recipients
      subject: req.body.subject, // Subject line
      html: emailContent // HTML body from the file
    };
  
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return next(new AppError(`Error occurred while sending email: ${error.message}`, 500));
      }
      console.log('Email sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
      res.status(200).json({
        message: !req.isSignup?`Reset token has been sent to ${req.body.to}`:`to verify your email check the mail send to ${req.body.to}`
      });
    });
  });
  