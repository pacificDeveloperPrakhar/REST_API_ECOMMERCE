const jwt=require("jsonwebtoken")
module.exports=function(obj){
  const issueAt=(new Date())
const details=Object.assign({},obj,{issueAt})
console.log(details)
const token=jwt.sign(details,process.env.secret_key,{expiresIn:process.env.expiresIn})
return token
}