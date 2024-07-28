const express=require("express")
const {getAllProducts,createProduct,getProductById,updateProduct,deleteProduct}=require("../controllers/productController")
const router=express.Router()
router.route("/:id").get(getProductById).put(updateProduct).delete(deleteProduct)
router.route("/").get(getAllProducts).post(createProduct)
module.exports=router