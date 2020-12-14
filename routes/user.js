const express = require("express");
const router = express.Router();

// Controller Components
const { getUserById, getUser } = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

// This router .params will filter out any incoming Parameter, in this case userId with the help of 'getUserById Middleware from user controller.
router.param("userId", getUserById);

// Routes

// @Route:  GET - /user/userId
// @Desc:   Get an user from user id parameter.
// Access:  Private - isSignedIn, isAuthenticated
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

module.exports = router;