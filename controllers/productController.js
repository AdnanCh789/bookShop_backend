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
// Methods for product controller
// upload a single photo

exports.uploadProductPhoto = multer(multerOptions).single("photo");

//create a new product
exports.createProduct = catchAsync(async (req, res) => {
  const product = new Product(req.productData);
  res.send(product);
  await product.save();
});

exports.getProducts = catchAsync(async (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 3;

  const products = await Product.find()
    .populate({
      path: "category",
      select: "name",
    })
    .sort([[sortBy, order]])
    .limit(limit)
    .exec();
  setTimeout(() => {
    res.send(products);
  }, 1000);
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
  const product = await Product.findById(id)
    .populate("category", "name _id")
    .exec();
  if (!product) return res.status(400).send("Product not found..");
  req.product = product;
  next();
};

exports.getProduct = (req, res) => {
  setTimeout(() => {
    res.send(req.product);
  }, 500);
};

exports.deleteProduct = catchAsync(async (req, res) => {
  const product = req.product;
  await product.remove();
  deleteImage(product.photo.publicId);
  res.send({ product: req.product });
});

exports.updateProduct = catchAsync(async (req, res) => {
  const { photo } = req.product;

  const product = await Product.findByIdAndUpdate(
    { _id: req.product._id },
    { $set: req.body },
    { new: true }
  );
  deleteImage(photo.publicId);

  res.send(product);
});

exports.getRelatedProducts = catchAsync(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 4;
  const products = await Product.find({
    category: req.product.category,
    _id: { $ne: req.product._id },
  })
    .limit(limit)
    .exec();

  res.send(products);
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

exports.search = catchAsync(async (req, res, next) => {
  const query = {};
  const { search, category } = req.query;

  if (search) query.name = { $regex: search, $options: "i" };

  if (category && category !== "all") query.category = category;

  // now find the products based on the query

  const products = await Product.find(query)
    .populate({
      path: "category",
      select: "name",
    })
    .exec();

  res.send(products);
});

exports.updateQuantity = catchAsync(async (req, res, next) => {
  let bulkOps = req.body.order.products.map((p) => {
    return {
      updateOne: {
        filter: { _id: p._id },
        update: { $inc: { quantity: -p.count, sold: +p.count } },
      },
    };
  });

  await Product.bulkWrite(bulkOps, {});

  next();
});
