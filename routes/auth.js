const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

// Controller Components
const { signout, signup, signin } = require("../controllers/auth");

// Route: SignUp
router.post(
  "/signup",
  // Incoming Req Body Validation
  [
    check("name", "Name should be atleast 3 characters long!").isLength({
      min: 3,
    }),
    check("email", "A valid Email is required!").isEmail(),
    check(
      "password",
      "Password should be atleast 3 characters long!"
    ).isLength({ min: 3 }),
  ],
  signup
);

// Route: SignIn
router.post(
  "/signin",
  // Incoming Req Body Validation
  [
    check("email", "A valid Email is required!").isEmail(),
    check(
      "password",
      "Password should be atleast 3 characters long!"
    ).isLength({ min: 3 }),
  ],
  signin
);

router.get("/signout", signout);

module.exports = router;
