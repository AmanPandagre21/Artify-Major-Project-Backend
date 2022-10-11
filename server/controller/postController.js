const Posts = require("../model/postsModel");
const User = require("../model/userModel");
const ErrorHandler = require("../utils/ErrorHandler");

// create Post

exports.createPost = async (req, res, next) => {
  try {
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// update Post
exports.updateTitleAndDescription = async (req, res, next) => {
  try {
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// like and unlike Post
exports.likeAndUnlike = async (req, res, next) => {
  try {
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// delete Post
exports.deletePost = async (req, res, next) => {
  try {
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
