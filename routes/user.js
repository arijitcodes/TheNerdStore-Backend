const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

// Controller Components
const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

// This router.params will filter out any incoming Parameter, in this case userId with the help of 'getUserById' Middleware from user controller.
router.param("userId", getUserById);

// Routes

// @Route:  GET - /user/userId
// @Desc:   Get an user from user id parameter.
// @Access: Private - isSignedIn, isAuthenticated
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

// @Route:  PUT - /user/userId
// @Desc:   Update an User - by the user itself.
// @Access: Private
router.put(
  "/user/:userId",
  [
    check(
      "name",
      "First Name is Required & should be atleast 3 characters long!"
    ).isLength({
      min: 3,
    }),
    check("lastName", "Last Name is Required!").exists({ checkFalsy: true }),
    check("name", "Only Alphabets are allowed in Name!").isAlpha(),
    check("lastName", "Only Alphabets are allowed in Last Name!").isAlpha(),
    check("email", "A valid Email is required!").isEmail(),
  ],
  isSignedIn,
  isAuthenticated,
  updateUser
);

// @Route:  GET - /orders/user/userId
// @Desc:   Get the Order Purchase List of the Logged In User.
// @Access: Private
router.get(
  "/orders/user/:userId",
  isSignedIn,
  isAuthenticated,
  userPurchaseList
);

module.exports = router;
