const express = require("express");
const router = express.Router();

// Controller Components
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");
const { getOrderById, createOrder } = require("../controllers/order");

// Parameter Extractor Middlewares

router.param("userId", getUserById);
router.param("orderId", getOrderById);

// Routes

// @Route:  POST - /order/create/:userId
// @Desc:   Create a new Order
// @Access: Private
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);

module.exports = router;
