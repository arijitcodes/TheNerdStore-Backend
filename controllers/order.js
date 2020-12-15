const { Order, ProductCart } = require("../models/order");

// Middlewares

// Parameter Extractors
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
