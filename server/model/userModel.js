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
      required: [true, "Please enter a Phone Number"],
      min: [10, "Number should contain 10 Numbers"],
      max: [12, "Number cannot exceed 12 characters"],
    },

    email: {
      type: String,
      required: false,
      validate: [validator.isEmail, "Please Enter a valid Email"],
    },

    password: {
      type: String,
      required: true,
      minLength: [8, "Password should be greater than 8 characters"],
      select: false,
    },

    avatar: {
      public_id: String,
      url: String,
    },

    isArtist: { type: Boolean, required: true, default: false },

    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
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
