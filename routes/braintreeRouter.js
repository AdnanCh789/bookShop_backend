const express = require("express");
const router = express.Router();
const { userById } = require("../controllers/userController");
const { requireSignin, isAuth } = require("../controllers/authController");
const {
  generateBraintreeToken,
  processPayment,
} = require("../controllers/braintreeController");

const authUser = [requireSignin, isAuth];

router.get("/getToken/:userId", authUser, generateBraintreeToken);
router.post("/payment/:userId", authUser, processPayment);

router.param("userId", userById);

module.exports = router;
