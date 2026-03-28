const Product = require("../models/Product");

// GET all products
exports.getProducts = async (req, res) => {
  const data = await Product.find();
  res.json(data);
};

// ADD product
exports.addProduct = async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json(newProduct);
};


