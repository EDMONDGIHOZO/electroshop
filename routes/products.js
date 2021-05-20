const express = require("express");
const { Product } = require("../models/Product");
const { Category } = require("../models/Category");
const { Router } = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get(`/`, async (request, response) => {
  let filterCat = {};

  if (request.query.categories) {
    filterCat = { category: request.query.categories.split(",") };
  }

  const products = await Product.find(filterCat).select("name image");

  const counts = await Product.countDocuments((count) => count);
  response.send({ message: "success", data: products, counts: counts });
});

router.get(`/get/featured/:number`, async (request, response) => {
  let count = request.params.number ? request.params.number : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);
  response.send({ message: "featured products", data: products });
});

// store the product
router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.send("cagory is wrong");

  const product = new Product({
    richDescription: req.body.richDescription,
    image: req.body.image,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    countStock: req.body.countStock,
  });

  product = await product.save();
  if (!product) return res.status(500).send("product can not be created");
  return res.send(product);
});

// get the single product
router.get("/:id", async (req, res) => {
  const product = await await Product.findById(req.params.id).populate(
    "category"
  );
  if (product)
    return res.send({
      data: product,
    });
  return res.status(404).send("not found");
});

// updating the product
router.put(`:/id`, async (request, response) => {
  // validate the id first of all
  if (!mongoose.isValidObjectId(req.params.id)) {
    return response.send("you entered the wrong Id");
  }
  const cat = await Category.findById(request.body.category);
  if (!cat) return response.send("the given category is not valid");

  let product = await Product.findOneAndUpdate(
    req.params.id,
    {
      richDescription: req.body.richDescription,
      image: req.body.image,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      countStock: req.body.countStock,
    },
    { new: true }
  );
  if (!product)
    return response.status(404).send("someting did not go well, so im sorry!");

  response.send({ message: "updted", data: product });
});

router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product)
        return res
          .status(200)
          .json({ success: true, message: "product is deleted successfuly" });
      else {
        return res
          .status(404)
          .json({ success: false, message: "the product was already gone" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
