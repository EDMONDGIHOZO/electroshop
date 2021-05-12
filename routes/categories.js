const { Category } = require("../models/Category");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const categories = await Category.find();
  if (categories) res.send({ success: true, data: categories });
  res.send(500).json({ message: "no data " });
});

router.post(`/`, async (request, response) => {
  const category = new Category({
    name: request.body.name,
    icon: request.body.icon,
    color: request.body.color,
  });

  await category
    .save()
    .then((newCategory) => {
      response.send(200).json({
        message: "saved",
        data: newCategory,
      });
    })
    .catch((err) => {
      console.log("error occured", +err);
    });
});

router.delete(`/:id`, (request, response) => {
  Category.findByIdAndRemove(request.params.id)
    .then((cat) => {
      if (cat)
        return response.status(200).json({ success: true, message: "deleted" });
      return response
        .status(404)
        .json({ success: false, message: "it was not there " });
    })
    .catch((err) => {
      return response.status(400).json({
        success: false,
        message: "someting weird happend and im sorry",
      });
    });
});

module.exports = router;
