const { Order, ProductCart } = require("../models/order");

// Middlewares

// Parameter Extractor Middleware
exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((error, order) => {
      if (error) {
        return res.status(400).json({ err: "Order not found!" });
      }

      req.order = order;
      next();
    });
};

// Controller Methods

// Create an Order
exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;

  const order = new Order(req.body.order);
  order.save((error, order) => {
    if (error) {
      return res.status(400).json({ err: "Failed to save order in DB!" });
    }

    res.json(order);
  });
};

// Get All Orders - Admin Only (Private)
exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name lastName")
    .sort("-createdAt")
    .exec((error, orders) => {
      if (error) {
        return res.status(400).json({ err: "No orders found!" });
      }

      return res.json(orders);
    });
};

// Get order status
exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

// Update Status - Private (Admin Only)
exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (error, order) => {
      if (error) {
        return res.status(400).json({ err: "Cannot update Order Status!" });
      }

      return res.json(order);
    }
  );
};
