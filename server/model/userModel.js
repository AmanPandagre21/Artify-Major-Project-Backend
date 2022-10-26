const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [2, "Name should have more than 4 characters"],
    },

    phone: {
      type: Number,
      minLength: [10, "Number should contain 10 Numbers"],
      maxLength: [12, "Number cannot exceed 12 characters"],
      required: false,
    },

    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: [true, "Email already exists"],
      validate: [validator.isEmail, "Please Enter a valid Email"],
    },

    bio: {
      type: String,
      required: false,
    },

    password: {
      type: String,
      required: true,
      minLength: [8, "Password should be greater than 8 characters"],
      select: false,
    },

    avatarUrl: {
      type: String,
    },

    isArtist: { type: Boolean, required: true, default: false },

    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
      },
    ],

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
      },
    ],

    ratings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

module.exports = mongoose.model("User", userSchema);
