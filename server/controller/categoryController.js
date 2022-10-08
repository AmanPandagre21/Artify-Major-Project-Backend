const ErrorHandler = require("../utils/ErrorHandler");
const Category = require("../model/categoryModel");

// add category api
exports.addCategory = async (req, res, next) => {
  try {
    //  get category name
    const { name } = req.body;

    if (!name) {
      return next(new ErrorHandler("Name field is required", 400));
    }

    // add data into db
    const category = await Category.create({ name });

    res
      .status(200)
      .json({ success: true, message: "Category added Succesfully", category });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// get all categories api
exports.getAllCategories = async (req, res, next) => {
  try {
    // add data into db
    const categories = await Category.find();

    res.status(200).json({ success: true, categories });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// remove category api
exports.removeCategory = async (req, res, next) => {
  try {
    // add data into db
    await Category.findByIdAndDelete({ _id: req.params.id });

    res
      .status(200)
      .json({ success: true, message: "Category Deleted Succesfully" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
