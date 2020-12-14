const express = require("express");
const router = express.Router();

// Controller Components
const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

// Parameter Extractors

router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

// Routes

// @Route:  POST - /category/create/userId
// @Desc:   Create a new Category
// @Access: Private (Admin Only)
router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

// @Route:  GET - /category/categoryId
// @Desc:   Get a Category from ID
// @Access: Public
router.get("/category/:categoryId", getCategory);

// @Route:  GET - /categories
// @Desc:   Get all Categories
// @Access: Public
router.get("/categories", getAllCategory);

// @Route:  UPDATE - /category/categoryId
// @Desc:   Update a Category
// @Access: Private (Admin Only)
router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

// @Route:  DELETE - /category/categoryId
// @Desc:   Delete a Category
// @Access: Private (Admin Only)
router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteCategory
);

module.exports = router;
