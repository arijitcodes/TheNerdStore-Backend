const User = require("../models/user");

exports.signup = (req, res) => {
  const user = new User(req.body);

  user.save((error, response) => {
    if (error) {
      return res.status(400).json({ err: "Unable to save User in Database!" });
    }
    res.json({
      name: response.name,
      email: response.email,
      id: response._id,
    });
  });
};

exports.signout = (req, res) => {
  res.json({
    message: "User Signed Out!",
  });
};
