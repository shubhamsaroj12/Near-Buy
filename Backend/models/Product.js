const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: String,
  price: Number,
  dist: Number,
  rating: Number,
});

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  image: String,
  shops: [shopSchema],
});

module.exports = mongoose.model("Product", productSchema);
