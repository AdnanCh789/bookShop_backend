const express = require("express");
const router = express.Router();
const {
  requireSignin,
  isAdmin,
  isAuth,
} = require("../controllers/authController");
const {
  userById,
  getUserById,
  updateUserById,
  getProfile,
} = require("../controllers/userController");
router.get("/me", [requireSignin, getProfile]);
router.get("/:userId", [requireSignin, isAuth], getUserById);
router.put("/:userId", [requireSignin, isAuth], updateUserById);

router.param("userId", userById);

module.exports = router;
