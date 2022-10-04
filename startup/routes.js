//require
const authRoutes = require("../routes/authRouter");
const userRoutes = require("../routes/userRouter");
const categoryRoutes = require("../routes/categoryRouter");
const productRoutes = require("../routes/productRouter");
const braintreeRoutes = require("../routes/braintreeRouter");
const ordersRoutes = require("../routes/ordersRouter");

const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const AppError = require("../utils/appError");
const express = require("express");

module.exports = (app) => {
  //middlewares
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(cookieParser());
  app.use(cors());

  //routes middlewares
  app.use("/api/user", userRoutes);
  app.use("/api", authRoutes);
  app.use("/api/category", categoryRoutes);
  app.use("/api/product", productRoutes);
  app.use("/api/braintree", braintreeRoutes);
  app.use("/api/orders", ordersRoutes);

  //
  // app.all("*", (req, res, next) => {
  //   next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
  // });

  //error
};
