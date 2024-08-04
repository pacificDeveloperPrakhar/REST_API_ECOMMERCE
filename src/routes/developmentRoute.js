const express=require("express")
const {sendWhatsappMssg,sendSMS,sendMail,sendMailt}=require("../controllers/communicationController")
const passport = require("passport")
const router=express.Router()
router.route('/sms').get(sendSMS)
router.route('/wassup').get(sendWhatsappMssg)
router.route('/mail').post(sendMail)
router.route('/authenticateWithSession').post()
router.route('/login').get((req, res, next) => {

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
          }
          form {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          input[type="text"],
          input[type="password"] {
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
          button {
            width: 100%;
            padding: 10px;
            background-color: #007BFF;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <form action="http://127.0.0.1:1234/api/v1/develop/login_auth" method="POST">
          <h2>Login</h2>
          <input type="text" name="email" placeholder="Username" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      </body>
      </html>
    `;
    
    res.send(html);
  });
  router.route('/login_auth').post(passport.authenticate('local'),(req,res)=>{
    res.send('done authenticating using passport local')
  })
module.exports=router