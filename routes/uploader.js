const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.post("images", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({ message: "error occured", error: err });
    } else {
      res.send(req.file);
    }
  });
});

module.exports = router;
