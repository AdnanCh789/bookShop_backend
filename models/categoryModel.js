const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 30,
    },
  },
  { timestamps: true }
);

function validateCategory(category) {
  const schema = Joi.object().keys({
    name: Joi.string().min(4).max(32).required(),
  });
  return schema.validate(category);
}
module.exports.Category = mongoose.model("Category", categorySchema);
module.exports.validateCategory = validateCategory;
