const express = require("express");
const router = express.Router();

// Controller Components
const { getProductById, createProduct } = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// Parameter Extractors
router.param("userId", getUserById);
router.param("productId", getProductById);

// Routes

// @Route:  POST - /product/create/userId
// @Desc:   Create a new Product
// @Access: Private (Admin Only)
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

module.exports = router;
