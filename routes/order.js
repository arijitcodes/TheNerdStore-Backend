const express = require("express");
const router = express.Router();

// Controller Components
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");
const {
  getOrderById,
  createOrder,
  getOrder,
  getAllOrders,
  getOrderStatus,
  updateStatus,
  getOrders,
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
  createOrder,
  getOrders
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

// @Route:  GET - /order/status/:userId
// @Desc:   Get Order Status
// @Access: Private (Admin Only)
router.get(
  "/order/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);

// @Route:  GET - /orders/:userId
// @Desc:   Get All Orders of Logged In User
// @Access: Private
router.get("/orders/:userId", isSignedIn, isAuthenticated, getOrders);

// @Route:  GET - /order/:orderId/:userId
// @Desc:   Get An Order
// @Access: Private
router.get("/order/:orderId/:userId", isSignedIn, isAuthenticated, getOrder);

// @Route:  PUT - /order/:orderId/status/:userId
// @Desc:   Update Order Status of specific order
// @Access: Private (Admin Only)
router.put(
  "/order/:orderId/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateStatus
);

module.exports = router;
