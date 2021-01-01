const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
    },
    zipcode: {
      type: Number,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      default: "Others",
      enum: ["Home", "Work", "Others"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
