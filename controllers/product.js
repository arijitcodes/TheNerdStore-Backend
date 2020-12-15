const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { sortBy } = require("lodash");

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

// Photo sending middleware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
};

// Update Stock
exports.updateStock = (req, res, next) => {
  // Preparing for Mongoose BulkWrite Operation
  let myOperations = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -product.count, sold: +product.count } },
      },
    };
  });

  // Mongoose BulkWrite operation
  Product.bulkWrite(myOperations, {}, (error, products) => {
    if (error) {
      return res.status(400).json({ err: "Failed to update stocks!" });
    }

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

// Get A Product
exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

// Get All Products - List Products
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((error, products) => {
      if (error) {
        return res.status(400).json({ err: "No products found!" });
      }

      res.json(products);
    });
};

// Update a product
exports.updateProduct = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (error, fields, file) => {
    if (error) {
      return res
        .status(400)
        .json({ err: "Problem with Image. Upload failed!" });
    }

    // Updating New Data in 'product'
    let product = req.product;
    product = _.extend(product, fields);

    // Handling Files
    if (file.photo) {
      // Checking file size
      if (file.photo.size > 3000000) {
        return res.status(400).json({ err: "File size is too big!" });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // Save and update in DB
    product.save((error, product) => {
      if (error) {
        return res.status(400).json({ err: "Could not update Product in DB!" });
      }

      res.json(product);
    });
  });
};

// Delete Product
exports.deleteProduct = (req, res) => {
  let product = req.product;

  product.remove((error, product) => {
    if (error) {
      return res.status(400).json({ err: "Failed to Delete product!" });
    }

    res.json({ message: "Deleted product Successfully!" });
  });
};
