const User = require("../models/user");

// Sets 'profile' in 'req' with User by ID of Logged in User  -  Middleware
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({ err: "User not found!" });
    }

    req.profile = user;
    next();
  });
};

// Get Logged In user's profile
exports.getUser = (req, res) => {
  //
  // Removing salt, encryptedPassword, and created, updated info from the req.profile section - as the user wont need that.
  req.profile.salt = undefined;
  req.profile.encryptedPassword = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;

  return res.json(req.profile);
};

// Update User
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (error, user) => {
      if (error || !user) {
        return res.status(400).json({ err: "Update failed!" });
      }

      user.salt = undefined;
      user.encryptedPassword = undefined;
      return res.json(user);
    }
  );
};
