const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

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

// Controller Methods

// Create Product
exports.createProduct = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (error, fields, file) => {
    if (error) {
      return res
        .status(400)
        .json({ err: "Problem with Image. Upload failed!" });
    }

    // De-structure the incoming fields
    const { name, description, price, category, stock } = fields;

    // Restrictions on field
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ err: "Please include all the fields!" });
    }

    let product = new Product(fields);

    // Handling Files
    if (file.photo) {
      // Checking file size
      if (file.photo.size > 3000000) {
        return res.status(400).json({ err: "File size is too big!" });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // Save in DB
    product.save((error, product) => {
      if (error) {
        return res.status(400).json({ err: "Could not save Product in DB!" });
      }

      res.json(product);
    });
  });
};
