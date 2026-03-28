const Product = require("../models/Product");
const crypto = require("crypto");
const { getProducts, saveProducts } = require("../lib/fileStore");

// GET all products
exports.getProducts = async (req, res) => {
  if (req.app.locals.useFileDb) {
    const data = await getProducts();
    return res.json(data);
  }

  const data = await Product.find();
  res.json(data);
};

// ADD product
exports.addProduct = async (req, res) => {
  if (req.app.locals.useFileDb) {
    const products = await getProducts();
    const newProduct = { _id: crypto.randomUUID(), ...req.body };
    products.push(newProduct);
    await saveProducts(products);
    return res.json(newProduct);
  }

  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json(newProduct);
};


