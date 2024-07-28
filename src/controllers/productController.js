const mongoose = require('mongoose');
const Product = require('../models/product.js');
const catchAsync = require('../utils/catchAsync.js');

// Controller to get all products
exports.getAllProducts = catchAsync(async function (req, res, next) {
  const products = await Product.find();
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

// porduct controller for the post method creating a new product
exports.createProduct = catchAsync(async function (req, res, next) {
  const newProduct = await Product.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct
    }
  });
});

// Controller to get a specific product by ID
exports.getProductById = catchAsync(async function (req, res, next) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      status: 'fail',
      message: 'No product found with that ID'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

// Controller to update a specific product by ID
exports.updateProduct = catchAsync(async function (req, res, next) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!product) {
    return res.status(404).json({
      status: 'fail',
      message: 'No product found with that ID'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

exports.deleteProduct = catchAsync(async function (req, res, next) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({
      status: 'fail',
      message: 'No product found with that ID'
    });
  }
  res.status(201).json({
    status: 'success',
    data: product
  });
});
