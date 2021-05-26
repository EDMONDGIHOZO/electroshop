const { Category } = require("../models/Category");
const express = require("express");
const router = express.Router();

// ========== show all categories available ================= //
router.get(`/`, async (req, res) => {
  const categories = await Category.find();
  if (categories) res.status(200).json({ success: true, data: categories });
  res.send(500).json({ message: "no data " });
});

// ========== created the category ================= //
router.post(`/`, async (request, response) => {
  const category = new Category({
    name: request.body.name,
    icon: request.body.icon,
    color: request.body.color,
  });

  await category
    .save()
    .then((newCategory) => {
      response.status(200).json({
        message: "saved",
        data: newCategory,
      });
    })
    .catch((err) => {
      console.log("error occured", +err);
    });
});

// ========== show single category ================= //

router.get(`/:id`, async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) res.status(200).json({ data: category });
  res.status(404).json({ message: "no data found" });
});

// ========== update the category ================= //

router.put("/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    { new: true }
  );

  if (category) {
    res.send(category);
  } else {
    res.status(400).send("category can not be updated");
  }
});

// ========== destroy the category ================= //
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
