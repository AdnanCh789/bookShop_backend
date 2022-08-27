const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("config");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
    history: {
      type: Array,
      default: [],
    },
    salt: Number,
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = config.get("salt");
    this.hashed_password = this.encryptedPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  validatePassword: async function (user) {
    return await bcrypt.compare(user.password, this.hashed_password);
  },
  generateAuthToken: function () {
    const token = jwt.sign(
      {
        _id: this._id,
        name: this.name,
        email: this.email,
        role: this.role,
      },
      config.get("jwtPrivateKey")
    );
    return token;
  },
  encryptedPassword: function (password) {
    if (!password) return (this.hashed_password = "");
    return (this.hashed_password = bcrypt.hashSync(this._password, this.salt));
  },
};

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().required().min(4).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5).max(255),
  });

  return schema.validate(user);
}
module.exports.validateUser = validateUser;
module.exports.User = mongoose.model("User", userSchema);
