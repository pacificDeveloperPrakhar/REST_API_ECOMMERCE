const mongoose=require("mongoose")
const cartSchema = new mongoose.Schema({
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'profiles', 
      required: true, 
      unique: true // Ensures each user can only have one cart
    },
    cartItems: [
      {
        product: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'products', 
          required: true 
        },
        quantity: { 
          type: Number, 
          required: true, 
        }
      }
    ],
    recentlyModifiedAt: { 
      type: Date, 
      default: Date.now 
    }
  });
  
  const Cart = mongoose.model('Cart', cartSchema);
  module.exports=Cart