const express = require("express");
const { Product } = require("../models/Product");
const { Category } = require("../models/Category");
const router = express.Router();

router.get(`/`, async (request, response) => {
  const products = await Product.find().select("name image -_id");
  response.send({ message: "success", data: products });
});

// get the single product
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product)
    return res.send({
      data: product,
    });
  return res.status(404).send("not found");
});

// store the product
router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.send("cagory is wrong");

  const product = new Product({
    richDescription: "this is the fakest phone ever",
    image: "iphone.jpg",
    rating: 0,
    numReviews: 2,
    isFeatured: true,
    name: "huawei",
    description: "fake phone here",
    price: 44000,
    category: "609c668eaaa78a61ce2ab5b1",
    countStock: 23,
  });

  product = await product.save();
  if (!product) return res.status(500).send("product can not be created");
  return res.send(product);
});

module.exports = router;
