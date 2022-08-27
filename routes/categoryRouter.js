const express = require("express");
const {
  requireSignin,
  isAuth,
  isAdmin,
} = require("../controllers/authController");
const router = express.Router();

const {
  createCategory,
  categoryById,
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { userById } = require("../controllers/userController");

const authUser = [requireSignin, isAuth, isAdmin];

router.get("/all", getCategories);
router.get("/:categoryId", getCategory);
router.post("/create/:userId", authUser, createCategory);
router.put("/update/:categoryId", updateCategory);
router.delete("/delete/:userId/:categoryId", authUser, deleteCategory);

router.param("categoryId", categoryById);
router.param("userId", userById);

module.exports = router;
