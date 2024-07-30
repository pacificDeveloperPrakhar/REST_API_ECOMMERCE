const Express = require("express");
const productRoute=require('./routes/productRoute')
const profileRoute=require("./routes/profileRoute.js")
const cookie_parser=require("cookie-parser")
const appError=require("./utils/appErrors")
const {colorRed,colorReset}=require("./utils/color_codes")
const app = Express();
app.use(cookie_parser())
app.use(Express.json({ limit: "30kb" }));
app.use('',(req,res,next)=>{
  console.log(req.query)
  next()
})
app.use('/api/v1/profiles',profileRoute);
app.use('/api/v1/products',productRoute);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      error: {
        message: err.message
      }
    });
  });
  app.all('*', (req, res, next) => {
   const err=new appError(`${req.originalUrl} was not found`,404)
   next(err)
  });
  app.use((err,req,res,next)=>{
    console.log("________________________________________________________________________________________")
    console.log(`${colorRed}${err?.stack}${colorReset}`)
    err.statusCode=err["status code"]||500;
    err.status=err.status||"action failed due to internal server error"
    res.status(500).json({
      status:err.status,
      "status code":err.statusCode,
      message:err.message,
      
    })
  })
module.exports=app