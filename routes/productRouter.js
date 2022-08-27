const express = require("express");
const router = express.Router();

const {
  requireSignin,
  isAuth,
  isAdmin,
} = require("../controllers/authController");

const { userById } = require("../controllers/userController");
const {
  createProduct,
  uploadProductPhoto,
  productValidation,
  getProduct,
  getProducts,
  getProductCategories,
  getAllProducts,
  getRelatedProducts,
  productById,
  deleteProduct,
  updateProduct,
  productsBySearch,
} = require("../controllers/productController");

const authUser = [
  requireSignin,
  isAuth,
  isAdmin,
  uploadProductPhoto,
  productValidation,
];

const deletion = [requireSignin, isAuth, isAdmin];

router.get("/", getProducts);
router.get("/all", getAllProducts);
router.get("/cat", getProductCategories);
router.get("/:productId", getProduct);
router.get("/related/:productId", getRelatedProducts);
router.post("/by/search/", productsBySearch);
router.post("/create/:userId", authUser, createProduct);
router.put("/update/:productId/:userId", authUser, updateProduct);
router.delete("/delete/:productId/:userId", deletion, deleteProduct);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
