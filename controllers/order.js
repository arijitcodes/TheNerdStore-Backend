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
