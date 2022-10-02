const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Your Category name"],
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [2, "Name should have more than 4 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

module.exports = mongoose.model("Category", categorySchema);
