const { Schema, model, default: mongoose } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    default: "____nothing added by the distributor_____"
  },
  brand: {
    type: mongoose.Schema.ObjectId,
    ref: "Brand",
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  },
  sizes: {
    type: [String],
    enum: ['S','XL','XXL','L'] 
  },
  colors: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Color",
  },
  distributor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: [true, 'Every product needs to have a registered distributor']
  },
  images: {
    iconURL: {
      type: String,
      required: [true, 'Product must have an icon image to preview']
    },
    previewsURLs: {
      type: [String]
    }
  },
  price: {
    type: Number,
    required: [true, 'The product must have a price']
  },
  stock: {
    recentPurchasedAt: Date,
    soldQty: {
      type: Number,
      required: [true, 'Sold quantity is required'],
      default: 0
    },
    stockAvailaibleQty: {
      type: Number
    },
    recentAddedAt: {
      type: Date,
      required: [true, 'The date when the product was added is required'],
      default: Date.now
    }
  },
  reviews: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Review"
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

const Product = model('Product', productSchema);
module.exports = Product;
