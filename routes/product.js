const express = require("express");
const router = express.Router();

// Controller Components
const {
  getProductById,
  createProduct,
  getProduct,
  getAllProducts,
  photo,
  updateProduct,
  deleteProduct,
  getAllUniqueCategories,
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// Parameter Extractors
router.param("userId", getUserById);
router.param("productId", getProductById);

// Routes

// @Route:  POST - /product/create/:userId
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

// @Route:  GET - /products
// @Desc:   Get all Products - List Products
// @Access: Public
router.get("/products", getAllProducts);

// @Route:  PUT - /product/:productId/:userId
// @Desc:   Update a Product
// @Access: Private (Admin Only)
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

// @Route:  DELETE - /product/:productId/:userId
// @Desc:   Delete a Product
// @Access: Private (Admin Only)
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

// @Route:  GET - /product/categories
// @Desc:   Get All Unique Categories
// @Access: Public
router.get("/product/categories", getAllUniqueCategories);

module.exports = router;
