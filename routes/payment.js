const express = require("express");
const router = express.Router();

// Middlewares
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

// Controllers
const { getToken, processPayment } = require("../controllers/payment");
const { getUserById } = require("../controllers/user");

// Custom Middlewares - Parameter Extractor Middlewares
router.param("userId", getUserById);

// @Route:  GET - /payment/gettoken/:userId
// @Desc:   Gets a Client Token for User
// @Access: Private
router.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated, getToken);

router.post(
  "/payment/braintree/:userId",
  isSignedIn,
  isAuthenticated,
  processPayment
);

module.exports = router;
