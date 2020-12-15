const express = require("express");
const router = express.Router();

// Controller Components
const {
  getProductById,
  createProduct,
  getProduct,
  photo,
} = require("../controllers/product");
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

// @Route:  GET - /product/:productId
// @Desc:   Get a Product
// @Access: Public
router.get("/product/:productId", getProduct);

// This sends the photo later on a different request after sending the primary product data.
router.get("/product/photo/:productId", photo);

module.exports = router;
