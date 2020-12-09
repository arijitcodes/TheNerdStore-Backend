exports.signup = (req, res) => {
  res.json({ message: "Signup Works!" });
};

exports.signout = (req, res) => {
  res.json({
    message: "User Signed Out!",
  });
};
