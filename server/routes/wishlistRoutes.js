const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  addToWhishList,
  removeFromWhishList,
  getAllItemsFromWhishList,
} = require("../controller/whishlistController");

router.route("/me/add-item:id").post(authMiddleware, addToWhishList);

router.route("/me/remove-item:id").post(authMiddleware, removeFromWhishList);

router.route("/me/items").get(authMiddleware, getAllItemsFromWhishList);

module.exports = router;
