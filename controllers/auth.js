const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

// Signup Controller
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

// Signin Controller
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

    // Sending response
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

// Signout Controller
exports.signout = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "User Signed out successfully!" });
};

// isSignedIn Middleware - for Protected Routes
exports.isSignedIn = expressJwt({
  secret: process.env.JWTSecret,
  userProperty: "auth",
});

// Custom Middlewares

// Check if User is Authenticated - Mainly for User Profile/Activity purpose - If the user is permitted to make the chnages they are trying to.
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.auth._id === req.profile._id;

  if (!checker) {
    return res.status(403).json({ err: "Access Denied!" });
  }

  next();
};

// Check if User is Admin
exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({ err: "You are Not Admin! Access Denied!" });
  }

  next();
};
