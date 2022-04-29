const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please add a product name"],
      unique: [true, "product already exists"],
    },
    description: {
      type: String,
      required: [true, "please write some description"],
    },
    size: {
      type: String,
    },
    color: { type: String },
    categories: {
      type: Array,
    },
    price: {
      type: Number,
      required: [true, "please add product price"],
    },
    img: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
