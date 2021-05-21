const { User } = require("../models/User");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// all users
router.get("/", async (req, res) => {
  const users = await User.find().select("-passwordHash");
  if (!users) {
    res.status(404).json({ message: "no users available now" });
  } else {
    res.status(200).json({ success: true, data: users });
  }
});

// single user
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) {
    res.status(404).json({ message: "no user available now" });
  } else {
    res.status(200).json({ success: true, data: user });
  }
});

router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    city: req.body.city,
  });

  user = await user.save();

  if (!user) {
    res.status(404).json({ success: false });
  } else {
    res.status(200).json({
      success: true,
      message: "user is saved",
    });
  }
});

// login the user
router.post("/login", async (req, res) => {
  // check if the user exist
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.SECRET_KEY;
  if (!user) {
    return res.status(404).json({ message: "this email does not exist" });
  } else {
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        secret,
        {
          expiresIn: "2d",
        }
      );
      res.status(200).send({ user: user.email, jwtToken: token });
    } else {
      res.status(400).json({ message: "password is wrong" });
    }
    return res.status(200).send(user);
  }
});
module.exports = router;
