const multer=require("multer")
const catchAsync=require("./catchAsync")
const path=require("path")
// storing the file logic
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        return cb(null,`public/images/${"dumpPics"||req.folder}`)
    },
    filename:(req,file,cb)=>{
        
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const userId=req?.user?.id||req.session.userId
        // i have also added the extension of the file to save the file in the local storage meaning in the remote directory to save the file in sutiable format 
        return cb(null, file.fieldname + '-' + uniqueSuffix+"_ID_"+userId+"."+file.mimetype.split('/')[1])    }
})
// file filtering logic
const fileFilter = function (req, file, cb) {
  console.log("req.mimeType:", req.typeMime); // Check the mimeType value
  if (req.typeMime?.includes("images")) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    console.log("File MIME Type:", file.mimetype);
    if (allowedMimeTypes.includes(file.mimetype)) {
      console.log("File accepted.");
      // Accept the file
      cb(null, true);
    } else {
      console.log("File rejected due to invalid MIME type.");
      // Reject the file
      cb(null, false);
    }
  } else {
    console.log("File type not supported.");
    cb(null, false);
  }
};

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');



// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key:process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

// Set up Cloudinary storage
const storageCloudinary = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profiles', // Optional folder to store the files in
    format: async (req, file) => 'png', // Optional format
    public_id: function(req,file){
        
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const userId=req?.user?.id||req.session.userId
      return file.fieldname + '-' + uniqueSuffix+"_ID_"+userId
   }

  },
});
// setting up the middleware that gonna take the parameters and store the file into the cloudinary
exports.storeToCloudinary=catchAsync(async function(req,res,next){
  const uploadToCloudinary=(filePath)=>{
    return new Promise((resolve,reject)=>{
      cloudinary.uploader.upload(filePath, { folder: 'dumpPics'||req.folder }, (error, result) => {
        // Delete the file after upload
        // fs.unlink(filePath, (err) => {
        //   if (err) console.error('Failed to delete temporary file:', err);
        // });

        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    })
  }
  let results=await Promise.all(req.files.map((file)=>{
    const filePath=path.resolve(__dirname,"../","../",file.path)
    return uploadToCloudinary(filePath)
  }))
  results=results.map((fileObj)=>{
    return {
      url:fileObj.secure_url,
      public_id:fileObj.public_id
    }
  })
  req.fileObjs=results
  next()
})
exports.uploadCloudinary=multer({storageCloudinary,fileFilter})
exports.uploadLocal=multer({storage,fileFilter})

