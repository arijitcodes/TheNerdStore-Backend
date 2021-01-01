const { validationResult } = require("express-validator");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

// Model
const User = require("../models/user");
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

// Get User's Display Picture
exports.getUserPhoto = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();
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

  if (!req.profile.photo.data) {
    // console.log("Photo NOT Detected!");
    req.profile.photo = false;
  } else {
    // console.log("Photo Detected!");
    // console.log(req.profile.photo);
    req.profile.photo = undefined;
  }

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

// Update User Photo
exports.updateUserPhoto = (req, res) => {
  // console.log("Photo Update was Hit");
  // console.log(req.body);
  let form = formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (error, fields, file) => {
    if (error) {
      return res
        .status(400)
        .json({ err: "Problem with Photo Upload! Upload Failed!" });
    }

    // Updating photo
    let photo = {};

    if (file.photo) {
      // Checking file size in Bytes  -  File cant be read if it is more than 17 MegaBytes : 17825792 Bytes
      // We will set the limit to 15 MB : 15728640 Bytes
      // Setting it 5 MB for now.
      // 1 MB = 1048576 Bytes
      const limitInMB = 5;

      const limitInBytes = limitInMB * 1048576;
      if (file.photo.size > limitInBytes) {
        return res.status(400).json({
          err: `Image size (${Math.round(
            file.photo.size / 1048576
          )} MB) too big! Max limit is: ${Math.round(limitInMB)} MB!`,
        });
      }

      photo.data = fs.readFileSync(file.photo.path);
      photo.contentType = file.photo.type;
    } else {
      console.log("No Photo");
    }

    // Save in DB
    User.findByIdAndUpdate(
      { _id: req.profile._id },
      { $set: { photo: photo } },
      { new: true, useFindAndModify: false },
      (error, user) => {
        if (error || !user) {
          console.log("Error: ", error);
          return res.status(400).json({ err: "Photo Update failed!" });
        }

        // Removing salt, encryptedPassword info from the req.profile section - as the user wont need that.
        user.salt = undefined;
        user.encryptedPassword = undefined;
        return res.json(user);
      }
    );
  });
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
