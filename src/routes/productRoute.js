const express=require("express")
const {getAllProducts,createProduct,getProductById,updateProduct,deleteProduct,updateTheProductImages}=require("../controllers/productController")
const {authenticateRequest}=require("../controllers/authControllers.js")
const {uploadCloudinary,uploadLocal, storeToCloudinary}=require("../utils/multerConfig.js")
const router=express.Router()
router.route("/authenticate").get(authenticateRequest,(req,res)=>{
    res.status(200).json({
        message:"request has been authorized"
    })
})
router.route("/:productId").post((req,res,next)=>{req.typeMime=["images,videos"];req.folder="products";next()},uploadLocal.array("images",6),storeToCloudinary,updateTheProductImages)
router.route("/:id").get(getProductById).put(updateProduct).delete(deleteProduct)
router.route("/").get(getAllProducts).post(createProduct)
module.exports=router