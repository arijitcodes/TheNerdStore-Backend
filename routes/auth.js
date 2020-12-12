const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

// Components
const { signout, signup } = require("../controllers/auth");

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

router.get("/signout", signout);

module.exports = router;
