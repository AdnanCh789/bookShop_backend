const express = require("express");
const router = express.Router();

const {
  userById,
  addOrderToUserHistory,
} = require("../controllers/userController");
const {
  requireSignin,
  isAuth,
  isAdmin,
} = require("../controllers/authController");
const {
  createOrder,
  listOrders,
  getStatusValues,
  updateStatusValues,
  orderById,
  purchaseHistory,
} = require("../controllers/ordersController");
const { updateQuantity } = require("../controllers/productController");

const authUser = [requireSignin, isAuth];

router.post(
  "/create/:userId",
  authUser,
  addOrderToUserHistory,
  updateQuantity,
  createOrder
);
router.get("/list/:userId", authUser, isAdmin, listOrders);
router.get("/history/:userId", authUser, purchaseHistory);
router.get("/status-values/:userId", authUser, isAdmin, getStatusValues);
router.put(
  "/status-update/:orderId/:userId",
  authUser,
  isAdmin,
  updateStatusValues
);

router.param("userId", userById);
router.param("orderId", orderById);

module.exports = router;
