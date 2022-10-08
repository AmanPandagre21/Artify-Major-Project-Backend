const express = require("express");
const router = express.Router();

const {
  addCategory,
  removeCategory,
  getAllCategories,
} = require("../controller/categoryController");

router.route("/add-item").post(addCategory);

router.route("/remove-item").post(removeCategory);

router.route("/categories").get(getAllCategories);

module.exports = router;
