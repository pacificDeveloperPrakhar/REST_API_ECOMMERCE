const Express = require("express");
const productRoute=require('./routes/productRoute')
const app = Express();
app.use(Express.json({ limit: "30kb" }));
app.use('',(req,res,next)=>{
  console.log(req.query)
  next()
})
app.use('/api/v1/products',productRoute);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      error: {
        message: err.message
      }
    });
  });
module.exports=app