const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

// Middlewares & Controllers
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const {
  getAddressById,
  createAddress,
  getAnAddress,
  getPrimaryAddress,
  getAllAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/address");

//
//Custom Parameter Extractor Middlewares

// This router.params will filter out any incoming Parameter, in this case userId with the help of 'getUserById' Middleware from user controller.
router.param("userId", getUserById);

// This router.params will filter out any incoming Parameter, in this case addressId with the help of 'getAddressById' Middleware from user controller.
router.param("addressId", getAddressById);

//
// Routes

// @Route:  POST - /address/userId
// @Desc:   Create an Address for a Logged In User.
// @Access: Private - isSignedIn, isAuthenticated
router.post("/address/:userId", isSignedIn, isAuthenticated, createAddress);

// @Route:  GET - /address/primary/userId
// @Desc:   Get the Primary Address of an User from user id parameter.
// @Access: Private - isSignedIn, isAuthenticated
router.get(
  "/address/primary/:userId",
  isSignedIn,
  isAuthenticated,
  getPrimaryAddress
);

// @Route:  GET - /address/addressId/userId
// @Desc:   Get An Address of an User from address id parameter.
// @Access: Private - isSignedIn, isAuthenticated
router.get(
  "/address/:addressId/:userId",
  isSignedIn,
  isAuthenticated,
  getAnAddress
);

// @Route:  GET - /address/userId
// @Desc:   Get All Addresses of an User from user id parameter.
// @Access: Private - isSignedIn, isAuthenticated
router.get("/address/:userId", isSignedIn, isAuthenticated, getAllAddress);

// @Route:  PUT - /address/addressId/userId
// @Desc:   Update an Address of a Logged In User.
// @Access: Private - isSignedIn, isAuthenticated
router.put(
  "/address/:addressId/:userId",
  isSignedIn,
  isAuthenticated,
  updateAddress
);

// @Route:  DELETE - /address/addressId/userId
// @Desc:   Delete an Address for a Logged In User.
// @Access: Private - isSignedIn, isAuthenticated
router.delete(
  "/address/:addressId/:userId",
  isSignedIn,
  isAuthenticated,
  deleteAddress
);

module.exports = router;
