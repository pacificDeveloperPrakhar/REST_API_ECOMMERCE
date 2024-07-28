const { Schema, model, default: mongoose } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    unique:true
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
    required: [false, 'Every product needs to have a registered distributor']//remember to turn this flag to true after the creating of the user mvc 
  },
  images: {
    iconURL: {
      type: String,
      required: [false, 'Product must have an icon image to preview']
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
    ref: "Review",
    default:[]
  },
    // Modification details
    modification: {
        modifiedAt: {
          type: Date,
          default: Date.now, 
        },
        logs: [
          {
            modifiedAt: {
              type: Date,
              default: Date.now, // Default to current date
            },
            description: {
              type: String,
              required: [true, 'missing the description'], 
              default :"___no description added___"// Custom error message if not provided
            },
          },
        ],
      },
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

const Product = model('Product', productSchema);
module.exports = Product;
