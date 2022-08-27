const multer = require("multer");
const cloudinary = require("cloudinary");
const { Product, validateProduct } = require("../models/productModel");
const { multerOptions } = require("../helper/product/multer");
const { Category } = require("../models/categoryModel");
const catchAsync = require("../utils/catchAsync");

// Validations
const fieldsValidation = (req, res, next) => {
  // productData object added to req
  req.productData = req.file &&
    req.body && {
      ...req.body,
      photo: { publicId: req.file.filename, url: req.file.path },
    };

  // fields validation
  const { error } = validateProduct(req.productData);

  //if error => throw it to global error handler
  if (error) {
    //removing prev image
    deleteImage(req.file.filename);
    return res.status(400).send(error.details[0].message);
  }
  next();
};

//category validation
const categoryExists = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({
    _id: req.productData.category,
  }).exec();

  if (category && category.name) return next();

  deleteImage(req.file.filename);

  return res.status(400).send("category does not exixt..");
});
//product validation
validation = (req, res, next) => {
  //fields validation
  fieldsValidation(req, res, next);

  //category validation
  categoryExists(req, res, next);
};

exports.productValidation = async (req, res, next) => {
  if (!req.file) return res.status(400).send("Please attach all info..");

  //fields validation
  validation(req, res, next);
};

const deleteImage = async (image) => {
  try {
    await cloudinary.api.delete_resources(image);
  } catch (ex) {
    throw new Error(ex.message);
  }
};
//
//
//
//
//
//
//
//
//
//
// Methods for product controller
// upload a single photo

exports.uploadProductPhoto = multer(multerOptions).single("photo");

//create a new product
exports.createProduct = catchAsync(async (req, res) => {
  const product = new Product(req.productData);

  await product.save();

  // const newProduct = await Product.findById(product._id).populate(
  //   "category",
  //   "name",
  //   "_id"
  // );

  res.send(product);
});

exports.getProducts = catchAsync(async (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 2;

  const products = await Product.find()
    .select("-photo")
    .populate({
      path: "category",
      select: "name",
    })
    .sort([[sortBy, order]])
    .limit(limit)
    .exec();

  res.send(products);
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find()
    .populate({
      path: "category",
      select: "name",
    })
    .sort("createdAt")
    .exec();

  res.send(products);
});

exports.productById = async (req, res, next, id) => {
  const product = await Product.findById(id);
  if (!product) return res.status(400).send("Product not found..");
  req.product = product;
  next();
};

exports.getProduct = (req, res) => {
  res.send({ product: req.product });
};

exports.deleteProduct = catchAsync(async (req, res) => {
  const product = req.product;
  await product.remove();
  deleteImage(product.photo.publicId);
  res.send({ product: req.product });
});

exports.updateProduct = catchAsync(async (req, res) => {
  const { photo } = req.product;
  deleteImage(photo.publicId);
  const product = await Product.findByIdAndUpdate(
    { _id: req.product._id },
    { $set: req.body },
    { new: true }
  );
  res.send({ product });
});

exports.getRelatedProducts = catchAsync(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 4;
  const products = await Product.find({
    _id: { $ne: req.product },
    category: req.product.category,
  })
    .limit(limit)
    .exec();

  res.send({ products });
});

exports.getProductCategories = catchAsync(async (req, res, next) => {
  const categories = await Product.distinct("category").exec();

  res.send(categories);
});

exports.productsBySearch = catchAsync(async (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }
  const data = await Product.find(findArgs)
    .populate("category", "name _id")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec();

  res.json({
    size: data.length,
    data,
  });
});
