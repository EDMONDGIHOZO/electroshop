const Express = require("express");
const Mongoose = require("mongoose");
const Cors = require("cors");
const Morgan = require("morgan");
require("dotenv/config");

// middlewares
const productRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");
const usersRouter = require("./routes/users");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");
const multer = require("multer");

// initialize the express engine
const App = Express();

// app middleware
App.use(Cors());
App.options("*", Cors());
App.use(Express.json());
App.use(Morgan("tiny"));
App.use(authJwt());
App.use(errorHandler);
App.use("/public/uploads", Express.static(__dirname + "/public/uploads"));

// file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.filename + "-" + uniqueSuffix);
  },
});

// connect to database
Mongoose.connect(process.env.MONGO_CON, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.DB_NAME,
  useFindAndModify: false,
})
  .then(() => {
    console.log(`connection is successfully established`);
  })
  .catch((err) => {
    console.log(err);
  });

// routes
App.use(`/products`, productRouter);
App.use(`/categories`, categoriesRouter);
App.use(`/users`, usersRouter);

// then run the mofucking server
App.listen(3000, () => {
  console.log("connection is running");
});
