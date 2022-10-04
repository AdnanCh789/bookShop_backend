const { Order, Cart } = require("../models/ordersModel");
const catchAsync = require("../utils/catchAsync");

exports.orderById = async (req, res, next, id) => {
  const order = await Order.findById(id);
  if (!order) return res.status(400).send("No order found..");
  req.order = order;
  next();
};

exports.createOrder = catchAsync(async (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order).populate("user", "name _id");
  await order.save();
});

exports.listOrders = catchAsync(async (req, res) => {
  const orders = await Order.find().populate("user").exec();
  res.send(orders);
});

exports.getStatusValues = catchAsync(async (req, res) => {
  res.send(Order.schema.path("status").enumValues);
});

exports.updateStatusValues = catchAsync(async (req, res) => {
  await Order.findOneAndUpdate(
    { _id: req.order._id },
    { $set: { status: req.body.status } },
    { new: true }
  );
});

exports.purchaseHistory = catchAsync(async (req, res) => {
  const history = await Order.find({ user: req.profile._id }).populate(
    "user",
    "name _id"
  );
  res.send(history);
});
