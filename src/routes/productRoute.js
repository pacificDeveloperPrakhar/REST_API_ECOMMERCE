const express=require("express")
const {getAllProducts,createProduct,getProductById,updateProduct,deleteProduct}=require("../controllers/productController")
const {authenticateRequest}=require("../controllers/authControllers.js")
const router=express.Router()
router.route("/authenticate").get(authenticateRequest,(req,res)=>{
    res.status(200).json({
        message:"request has been authorized"
    })
})
router.route("/:id").get(getProductById).put(updateProduct).delete(deleteProduct)
router.route("/").get(getAllProducts).post(createProduct)
module.exports=router