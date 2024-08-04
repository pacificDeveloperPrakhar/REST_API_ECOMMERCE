const { Schema, model, default: mongoose } = require("mongoose");
const category=require("./category.js")
const brand=require("./brand.js")
const color=require("./color.js")
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
    type: [mongoose.Schema.ObjectId],
    ref: 'Category'
  },
  sizes: {
    type: [String],
    enum: ['S','XL','XXL','L'] 
  },
  colors: {
    type: [mongoose.Schema.Types.ObjectId],
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
// Helper function to parse numeric values
function parseIfNumeric(value) {
  if (typeof value === 'string' && value.trim() !== '') {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      return parsedValue;
    }
  }
  return null;
}

// Define the virtual `totalPrice` property
productSchema.virtual('totalPrice').get(function() {
  // Parse and validate price and stock
  const price = parseIfNumeric(this.price);
  const stock = parseIfNumeric(this.stock);

  // Calculate total price if both are valid numbers
  if (price !== null && stock !== null) {
    return price * stock;
  }
  
  // Return null or zero if any value is invalid
  return null;
}).set(function(){
  this.name_lord="alopathy"
});


productSchema.pre('validate', async function(next) {
  
  try {
    // Create arrays to store valid IDs
    let validCategories = [];
    let validColors = [];
    
    // Fetch and validate category IDs
    if (this.category.length) {
      const categoryPromises = this.category.map(id => category.findById(id));
      const categories = await Promise.all(categoryPromises);
      validCategories = categories.filter(cat => cat).map(cat => cat._id.toString());
    }
    
    // Fetch and validate brand ID
    if (this.brand) {
      const brandFound = await brand.findById(this.brand);
      if (brandFound) {
        this.brand = brandFound._id.toString(); // Ensure it's a string
      } else {
        this.brand = null; // or handle as appropriate
      }
    }
    
    // Fetch and validate color IDs
    if (this.colors.length) {
      const colorPromises = this.colors.map(id => color.findById(id));
      const colors = await Promise.all(colorPromises);
      validColors = colors.filter(col => col).map(col => col._id.toString());
    }
    
    // Update the document with only valid IDs
    this.category = validCategories;
    this.colors = validColors;

    // Continue to the next middleware

    next();
  } catch (err) {
    // Pass the error to the next middleware (error handler)
    console.log("error has been encountered in the pre middleware")
    next(err);
  }
});

const Product = model('Product', productSchema);
module.exports = Product;
