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
  let address = null;

  // Checking if First Address Entry, setting primary by default
  Address.find({ user: req.profile._id }, (error, addresses) => {
    if (error) {
      return res.status(400).json("Server Error!");
    }

    // Checking addresses length and if <= 0, then setting primary as true
    if (addresses.length <= 0) {
      req.body.primary = true;
    }

    address = new Address(req.body);

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
  });
};

// Get an Address
exports.getAnAddress = (req, res) => {
  if (req.address) {
    return res.json(req.address);
  } else {
    return res.status(400).json({ err: "Invalid Address!" });
  }
};

// Get Primary Address
exports.getPrimaryAddress = (req, res) => {
  Address.findOne({ user: req.profile._id, primary: true }).exec(
    (error, address) => {
      if (error || !address) {
        return res.status(400).json({ err: "No Primary Address found!" });
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
  if (req.address) {
    Address.findByIdAndUpdate(
      req.address._id,
      req.body,
      { new: true },
      (error, address) => {
        if (error) {
          return res
            .status(400)
            .json({ err: "Failed to update the Address! Please try again!" });
        } else {
          return res.json(address);
        }
      }
    );
  } else {
    return res.status(400).json({ err: "Invalid Address!" });
  }
};

// Delete An Address
exports.deleteAddress = (req, res) => {
  if (req.address) {
    const address = new Address(req.address);
    address.delete((error, address) => {
      if (error) {
        return res
          .status(400)
          .json({ err: "Can't delete the address! Please try again!" });
      } else {
        return res.json(address);
      }
    });
  } else {
    return res.status(400).json({ err: "Invalid Address!" });
  }
};
