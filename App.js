const Express = require("express");
const Mongoose = require("mongoose");
const Morgan = require("morgan");
require("dotenv/config");

// models
const Product = require("./models/Product");
// routers
const productRouter = require("./routes/products");

// initialize the express engine
const App = Express();

// configure the app
App.use(Express.json());
App.use(Morgan("tiny"));

// connect to database
Mongoose.connect(process.env.MONGO_CON, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "electro_shop",
})
  .then(() => {
    console.log(`connection is successfully established`);
  })
  .catch((err) => {
    console.log(err);
  });

//   routes
App.use(`/products`, productRouter);

// then run the mofucking server
App.listen(3000, () => {
  console.log("connection is running");
});
