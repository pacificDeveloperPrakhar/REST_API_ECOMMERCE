const mongoose = require("mongoose");
const AppError = require("../utils/appErrors");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
    message: {
      type: String,
      required: [true, "Please add a message"],
    },
    rating: {
      type: Number,
      required: [true, "Please add a rating between 1 and 5"],
      min: 1,
      max: 5,
    },
    uniqueFactor: {
      type: String,
      unique: true, // Ensure the index is created
    },
  },
  {
    timestamps: true,
  }
);
ReviewSchema.index({ uniqueFactor: 1 }, { unique: true });
ReviewSchema.pre("validate", function (next) {
  const productId = this.product.toString();
  const userId = this.user.toString();

  if (!userId || !productId) {
    return next(new AppError("No user ID or product ID was found", 400));
  }

  this.uniqueFactor = `${userId}_${productId}`;
  next();
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
