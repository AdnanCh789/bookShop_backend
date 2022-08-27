const { User } = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getUserById = async (req, res, next) => {
  res.send({ user: req.profile });
  next();
};

exports.updateUserById = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { $new: true }
  );

  res.send({ user: req.body });
});

exports.userById = async (req, res, next, id) => {
  const user = await User.findById(id);
  if (!user) return res.status(400).send("No user found..");
  req.profile = user;
  next();
};

exports.getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.auth._id);
  if (!user) return res.status(400).send("No user found..");
  res.send(user);
});
