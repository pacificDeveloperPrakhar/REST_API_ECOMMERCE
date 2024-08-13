const express=require("express")
const router=express.Router({mergeParams:true})
const {getAllCarts,deleteCart,getCart,addToTheCart}=require("../controllers/cartControllers.js")
router.route("/").get(getAllCarts).post(addToTheCart)
router.route("/:cartId").delete(deleteCart).get(getCart)
module.exports=router