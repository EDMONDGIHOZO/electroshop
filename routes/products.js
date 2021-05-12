const express = require("express");
const { Product } = require("../models/Product");
const router = express.Router();

router.get(`/`, async (request, response) => {
  const products = await Product.find();
  response.send({ message: "success", data: products });
});

router.post(`/`, (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countStock: req.body.countStock,
  });
  product
    .save()
    .then((prod) => {
      res.status(201).json(prod);
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.log(err);
    });
});

module.exports = router;
