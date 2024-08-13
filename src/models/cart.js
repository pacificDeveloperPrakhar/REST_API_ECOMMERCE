const mongoose=require("mongoose")
const cartSchema = new mongoose.Schema({
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true, 
      unique: true // Ensures each user can only have one cart
    },
    cartItems: [
      {
        product: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Product', 
          required: true 
        },
        quantity: { 
          type: Number, 
          required: true, 
          min: 1 
        }
      }
    ],
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  });
  
  const Cart = mongoose.model('Cart', cartSchema);
  module.exports=Cart