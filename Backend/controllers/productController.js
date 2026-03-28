const Product = require("../models/Product");
const crypto = require("crypto");
const { getProducts, saveProducts } = require("../lib/fileStore");

function normalizeName(value = "") {
  return value.trim().toLowerCase();
}

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
  const productName = req.body.name?.trim();
  const incomingShop = req.body.shops?.[0];

  if (!productName || !incomingShop?.name) {
    return res.status(400).json({ msg: "Product name and seller details are required" });
  }

  if (req.app.locals.useFileDb) {
    const products = await getProducts();
    const existingIndex = products.findIndex(
      (product) => normalizeName(product.name) === normalizeName(productName)
    );

    if (existingIndex !== -1) {
      const existingProduct = products[existingIndex];
      const nextShops = existingProduct.shops || [];
      const sellerShopIndex = nextShops.findIndex(
        (shop) => shop.name === incomingShop.name
      );

      if (sellerShopIndex !== -1) {
        nextShops[sellerShopIndex] = incomingShop;
      } else {
        nextShops.push(incomingShop);
      }

      products[existingIndex] = {
        ...existingProduct,
        name: productName,
        image: req.body.image || existingProduct.image,
        shops: nextShops,
      };

      await saveProducts(products);
      return res.json(products[existingIndex]);
    }

    const newProduct = {
      _id: crypto.randomUUID(),
      name: productName,
      image: req.body.image,
      shops: [incomingShop],
    };
    products.push(newProduct);
    await saveProducts(products);
    return res.json(newProduct);
  }

  const existingProduct = await Product.findOne({
    name: { $regex: `^${productName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
  });

  if (existingProduct) {
    const sellerShopIndex = existingProduct.shops.findIndex(
      (shop) => shop.name === incomingShop.name
    );

    if (sellerShopIndex !== -1) {
      existingProduct.shops[sellerShopIndex] = incomingShop;
    } else {
      existingProduct.shops.push(incomingShop);
    }

    existingProduct.name = productName;
    if (req.body.image) {
      existingProduct.image = req.body.image;
    }

    await existingProduct.save();
    return res.json(existingProduct);
  }

  const newProduct = new Product({
    name: productName,
    image: req.body.image,
    shops: [incomingShop],
  });
  await newProduct.save();
  res.json(newProduct);
};


