const Express = require("express");
const app = Express();
app.use(Express.json({ limit: "30kb" }));
module.exports=app