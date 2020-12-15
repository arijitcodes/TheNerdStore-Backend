const Product = require("../models/product");

// Middlewares
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((error, product) => {
      if (error) {
        return res.status(400).json({ err: "Product not found!" });
      }

      req.product = product;
      next();
    });
};
