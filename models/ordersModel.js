const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const CartItemSchema = new mongoose.Schema(
  {
    product: { type: ObjectId, ref: "Product" },
    name: { type: String },
    price: { type: Number },
    count: { type: Number },
  },
  { timestamps: true }
);
const OrderSchema = new mongoose.Schema(
  {
    products: [CartItemSchema],
    address: { type: String, required: true },
    amount: { type: Number, required: true },
    transaction_Id: { type: String },
    status: {
      type: String,
      default: "Not processed",
      enum: [
        "Not processed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
    },
    updated: Date,
    user: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports.Cart = mongoose.model("Cart", CartItemSchema);
module.exports.Order = mongoose.model("Order", OrderSchema);
