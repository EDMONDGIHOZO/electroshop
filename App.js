const Express = require("express");
const Mongoose = require("mongoose");
const Cors = require("cors");
const Morgan = require("morgan");
require("dotenv/config");

// middlewares
const productRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");

// initialize the express engine
const App = Express();

// configure the app
App.use(Cors());
App.options("*", Cors());
App.use(Express.json());
App.use(Morgan("tiny"));

// connect to database
Mongoose.connect(process.env.MONGO_CON, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.DB_NAME,
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

// then run the mofucking server
App.listen(3000, () => {
  console.log("connection is running");
});
