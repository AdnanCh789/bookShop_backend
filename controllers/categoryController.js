const { Category, validateCategory } = require("../models/categoryModel");
const catchAsync = require("../utils/catchAsync");

exports.createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const result = await Category.findOne({ name });
  if (result === null) {
    const category = new Category(req.body);
    const { error } = validateCategory(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    await category.save();
    res.send(category);
  }
  if (name === result.name)
    return res.status(400).send("Category Already Exist");

  next();
});

exports.getCategories = catchAsync(async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
});

exports.categoryById = async (req, res, next, id) => {
  const category = await Category.findById(id);
  if (!category) return res.status(400).send("Category dose not exist..");
  req.category = category;
  res.send({ category });
  next();
};

exports.getCategory = catchAsync(async (req, res) => {
  res.send({ category });
});

exports.updateCategory = catchAsync(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    { _id: req.category._id },
    { $set: req.body },
    { new: true }
  );
  res.send({ category: req.body });
});

exports.deleteCategory = catchAsync(async (req, res) => {
  const category = await Category.findByIdAndDelete({ _id: req.category._id });
  res.send({ category });
});
