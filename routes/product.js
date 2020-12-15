const express = require("express");
const router = express.Router();

// Controller Components
const { getProductById } = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// Parameter Extractors
router.param("userId", getUserById);
router.param("productId", getProductById);

// Routes

module.exports = router;
