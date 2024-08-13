const express=require("express")
const {getAllProducts,createProduct,getProductById,updateProduct,deleteProduct,updateTheProductImages}=require("../controllers/productController")
const {authenticateRequest}=require("../controllers/authControllers.js")
const reviewRoute=require("./reviewRoute.js")
const cartRoute=require("./cartRoutes.js")
const {uploadCloudinary,uploadLocal, storeToCloudinary}=require("../utils/multerConfig.js")
const router=express.Router()
router.route("/authenticate").get(authenticateRequest,(req,res)=>{
    res.status(200).json({
        message:"request has been authorized"
    })
})
router.use("/:productId/reviews",reviewRoute)
router.use("/:productId/carts",cartRoute)
router.route("/:productId").get(getProductById).put(updateProduct).delete(deleteProduct).post((req,res,next)=>{req.typeMime=["images,videos"];req.folder="products";next()},uploadLocal.array("images",6),storeToCloudinary,updateTheProductImages)
router.route("/").get(getAllProducts).post(createProduct)
module.exports=router