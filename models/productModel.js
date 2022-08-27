const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 30,
    },
    description: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 300,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    photo: {
      publicId: { type: String },
      url: { type: String },
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

function validateProduct(category) {
  const schema = Joi.object().keys({
    name: Joi.string().min(5).max(20).required(),
    description: Joi.string().min(10).max(1000),
    price: Joi.number().required(),
    quantity: Joi.number(),
    category: Joi.objectId().required(),
    sold: Joi.number(),
    photo: {
      publicId: Joi.string(),
      url: Joi.string(),
    },
    shipping: Joi.boolean(),
  });
  return schema.validate(category);
}

module.exports.Product = mongoose.model("Product", productSchema);
module.exports.validateProduct = validateProduct;
