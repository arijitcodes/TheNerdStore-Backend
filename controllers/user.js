const User = require("../models/user");
const { validationResult } = require("express-validator");

// Model
const { Order } = require("../models/order");

// Custom Middlewares

// Sets 'profile' in 'req' with User by ID of Logged in User  -  Middleware
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({ err: "User not found!" });
    }

    req.profile = user;
    next();
  });
};

// Push Order of User in Purchase List of User Collection
exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];

  // Store all Order Products in purchases array - Locally
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.count,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  // Store the purchases array in DB
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true, useFindAndModify: false },
    (error, purchases) => {
      if (error) {
        return res.status(400).json({ err: "Unable to save Purchase list!" });
      }
    }
  );

  next();
};

// Controller Methods

// Get Logged In user's profile
exports.getUser = (req, res) => {
  //
  // Removing salt, encryptedPassword, and created, updated info from the req.profile section - as the user wont need that.
  req.profile.salt = undefined;
  req.profile.encryptedPassword = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;

  return res.json(req.profile);
};

// Update User
exports.updateUser = (req, res) => {
  // Checking if there are any errors from the Body Validation in Routes
  const errors = validationResult(req);

  // If there are errors, respond with the first error
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      parameter: errors.array()[0].param,
    });
  }

  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (error, user) => {
      if (error || !user) {
        return res.status(400).json({ err: "Update failed!" });
      }

      // Removing salt, encryptedPassword info from the req.profile section - as the user wont need that.
      user.salt = undefined;
      user.encryptedPassword = undefined;
      return res.json(user);
    }
  );
};

// Logged In User's Purchase List
exports.userPurchaseList = (req, res) => {
  Order.find({ _id: req.profile._id })
    .populate("user", "_id name")
    .exec((error, order) => {
      if (error) {
        return res.status(400).json({ err: "No Orders Found!" });
      }

      return res.json(order);
    });
};
