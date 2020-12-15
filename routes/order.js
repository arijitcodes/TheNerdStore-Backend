const express = require("express");
const router = express.Router();

// Controller Components
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");
const {
  getOrderById,
  createOrder,
  getAllOrders,
} = require("../controllers/order");

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

// @Route:  GET - /order/all/:userId
// @Desc:   Get All Orders
// @Access: Private (Admin Only)
router.get(
  "/order/all/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);

module.exports = router;
