const User = require("../models/user");
const { validationResult } = require("express-validator");

exports.signup = (req, res) => {
  // Checking if there are any errors from the Body Validation in Routes
  const errors = validationResult(req);

  // If there are errors, respond with the first error
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      parameter: errors.array()[0].param,
    });
  }

  // If No Errors, then proceed to store user in DB
  const user = new User(req.body);
  user.save((error, response) => {
    if (error) {
      return res.status(400).json({ err: "Unable to save User in Database!" });
    }
    res.json({
      name: response.name,
      email: response.email,
      id: response._id,
    });
  });
};

exports.signout = (req, res) => {
  res.json({
    message: "User Signed Out!",
  });
};
