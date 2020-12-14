const express = require("express");
const router = express.Router();

// Controller Components
const {
  getCategoryById,
  getCategory,
  getAllCategory,
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

// @Route:  GET - /category/categoryId
// @Desc:   Get all Categories
// @Access: Public
router.get("/categories", getAllCategory);

module.exports = router;
