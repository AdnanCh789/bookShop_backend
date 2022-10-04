const { User } = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
exports.getUserById = async (req, res, next) => {
  res.send({ user: req.profile });
  next();
};

exports.updateUserById = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { $new: true }
  );

  await user.save();
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send({ user: req.body });
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

exports.addOrderToUserHistory = catchAsync(async (req, res, next) => {
  let history = [];
  req.body.order.products.forEach((item) => {
    history.push({
      _id: item._id,
      name: item.name,
      category: item.category,
      description: item.description,
      quantity: item.conut,
      transaction_id: req.body.order.transaction_id,
      amount: req.body.order.amount,
    });
  });

  await User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $push: { history: history } },
    { $new: true }
  );
  next();
});
