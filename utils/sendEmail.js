const nodemailer=require("nodemailer")
module.exports=async function sendEmail(options){
const {email,token}=options
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "b44af525ac963e",
    pass: "07e0bebf5de611",
  },
});
transporter.sendMail({
  from: "yamamotoyuki007@gmail.com",
  to: email,
  subject: "Tours API",
  text: `your verification code is ${token} this verificaton code will expire after 3 minute`,
});
}