const { User, validateUser } = require("../models/userModel");
const _ = require("lodash");
const expressJwt = require("express-jwt");
const config = require("config");

const catchAsync = require("../utils/catchAsync");
//validations
exports.validateSignup = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exists..");
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  next();
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = new User(req.body);
  await user.save();

  res.send(_.pick(user, ["_id", "name", "email", "role"]));
  next();
});

exports.signin = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send("Email or Password not match, please Signup..");
  const result = await user.validatePassword(req.body);
  if (!result) return res.status(400).send("Password Incorrect..");
  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email", "role"]));
  next();
});

exports.signout = catchAsync(async (req, res, next) => {
  res.send("Signed out successfully");

  next();
});

exports.isAuth = catchAsync(async (req, res, next) => {
  const user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) return res.status(401).send("Access denied..");
  next();
});

exports.isAdmin = catchAsync(async (req, res, next) => {
  if (req.profile.role === 0)
    return res.status(403).send("Admin Resource! Access denied..");
  next();
});

exports.requireSignin = expressJwt({
  secret: config.get("jwtPrivateKey"),
  userProperty: "auth",
  algorithms: ["HS256"],
});
