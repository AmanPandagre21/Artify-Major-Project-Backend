const express = require("express");
const router = express.Router();

const {
  addCategory,
  removeCategory,
  getAllCategories,
} = require("../controller/categoryController");

router.route("/add-item").post(addCategory);

router.route("/remove-category/:id").delete(removeCategory);

router.route("/categories").get(getAllCategories);

module.exports = router;
