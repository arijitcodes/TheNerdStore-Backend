const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

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

exports.signin = (req, res) => {
  //
  // Checking if there are any errors from the Body Validation in Routes
  const errors = validationResult(req);

  // If there are errors, respond with the first error
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  // Else, proceed to log in
  const { email, password } = req.body;

  // Checking for user given Email
  User.findOne({ email }, (error, user) => {
    // If email doesnt exist in DB, return email not found error
    if (error || !user) {
      return res.status(400).json({ err: "User's email does not exist!" });
    }

    // If email exists, running Authenticate() from Schema, to check if User's email and passwords match!
    // If passwords don't match, retunr error
    if (!user.authenticate(password)) {
      return res.status(401).json({ err: "Email and Password do not match!" });
    }

    // Else, Login

    // Creating Token
    const token = jwt.sign({ _id: user._id }, process.env.JWTSecret);

    // Put token in cookie
    res.cookie("token", token, { expire: new Date() + 5555 });
    console.log(user);
    // Sending response
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

exports.signout = (req, res) => {
  res.json({
    message: "User Signed Out!",
  });
};
