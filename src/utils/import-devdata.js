const  mongoose =require("mongoose")
const geturl = require("../utils/get_connection_url.js");
const tourModel = require("../model/tourModel.js");
const url = geturl("test", process.env.user, process.env.password);
const dotenv=require("dotenv")
dotenv.config({path:'../config.env'})
const fs=require("fs")

mongoose.connect(url).catch(err=>console.log(err));
const db=mongoose.connection;
db.once("open",()=>{
  console.log(`connected to the port ${db.port}`)
})
db.on("error",(err)=>{
  console.log(err)
})
const cmd = process.argv.find((arg) => arg == "--import")||(process.argv.find((arg)=>arg=="--delete"));
if(cmd=='--import'){
 
  // importData()
}
else if (cmd == "--delete") {
  // deleteData()
}
fs.readFile("../data/tours.json",'utf-8',(data=>{
tourModel.create(JSON.parse(data)).then((data)=>{
  console.log("imported successfully")
  db.close()
});
}))
function importData(){
  

}