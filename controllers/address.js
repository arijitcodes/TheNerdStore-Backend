// Model
const Address = require("../models/address");

// Controllers

// Parameter Extractor Middleware Controller

exports.getAddressById = (req, res, next, id) => {
  Address.findById(id).exec((error, address) => {
    if (error) {
      return res.status(400).json({ err: "Address Not Found!" });
    }

    req.address = address;
    next();
  });
};

//
// Normal Controllers

// Create Address
exports.createAddress = (req, res) => {
  const address = new Address(req.body);

  // Saving incoming req in DB
  address.save((error, address) => {
    if (error) {
      console.log(error);
      return res
        .status(400)
        .json({ err: "Failed to save Address! Please Try Again!" });
    } else {
      return res.json(address);
    }
  });
};

// Get an Address
exports.getAnAddress = (req, res) => {
  if (req.address) {
    return res.json(req.address);
  }
};

// Get Primary Address
exports.getPrimaryAddress = (req, res) => {
  Address.findOne({ user: req.profile._id, primary: true }).exec(
    (error, address) => {
      if (error) {
        return res
          .status(400)
          .json({ err: "No Primary Address found for this User!" });
      } else {
        return res.json(address);
      }
    }
  );
};

// Get All Addresses
exports.getAllAddress = (req, res) => {
  Address.find({ user: req.profile._id }).exec((error, addresses) => {
    if (error) {
      return res.status(400).json({ err: "No saved Addresses found!" });
    }

    return res.json(addresses);
  });
};

// Update An Address
exports.updateAddress = (req, res) => {
  //
};

// Delete An Address
exports.deleteAddress = (req, res) => {
  //
};
