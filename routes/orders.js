const { Order } = require("../models/order");
const express = require("express");
const { OrderItem } = require("../models/orderItem");
const router = express.Router();

// view all orders in system

router.get("/", async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });
  if (!orders) {
    return res.status(401).json({ message: "no order placed yet" });
  } else {
    return res.status(200).json({ message: "found", data: orders });
  }
});
// placing an order
router.post(`/`, async (request, response) => {
  const itemsIds = Request.body.orderItems.map(async (i) => {
    let newOrderItem = new OrderItem({
      quantity: i.quantity,
      product: i.product,
    });
    newOrderItem = await newOrderItem.save();
    return newOrderItem._id;
  });

  const orderItemsIdsResolved = await itemsIds;
  // find the total price for single item in an order
  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map((orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "products",
        "price"
      );

      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((it, em) => it + em, 0);

  const order = new Order({
    orderItems: request.body.orderItems,
    shippingAddress: request.body.shippingAddress,
    city: request.body.city,
    phone: request.body.phone,
    totalPrice: totalPrice,
  });

  await order
    .save()
    .then((newOrder) => {
      response.send(200).json({
        message: "saved",
        data: newOrder,
        items: orderItemsIdsResolved,
      });
    })
    .catch((err) => {
      console.log("error occured", +err);
    });
});

// view single order
router.get("/:id", async (req, res) => {
  const order = await (await Order.findById(req.params.id))
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });

  if (!order) {
    return res
      .status(401)
      .json({ message: "the order is not available in database" });
  } else {
    res.status(200).json({ success: true, data: order });
  }
});

// update the status of the order
router.put("/:id", async (req, res) => {
  // check availabity
  const order = await Order.findByIdAndUpdate(req.params.id, {
    status: req.body.status,
  });
  if (!order) {
    res
      .status(404)
      .json({ message: "what are trying to do, this order does'nt exist man" });
  } else {
  }
});

// removing the order with it's items
router.delete("/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await orderItem.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "the order items gone" });
      } else {
        return res.status(404).json({ success: false, message: "not found" });
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "unexpected error from the server" });
    });
});

module.exports = router;
