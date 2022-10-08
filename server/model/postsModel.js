const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  artist: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  outOfStock: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Posts", postsSchema);
