const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createOrder,
  getMyOrder,
  updateOrder,
} = require("../controller/orderController");

router.route("/order/new").post(authMiddleware, createOrder);

router.route("/my-orders").get(authMiddleware, getMyOrder);

router.route("/update-order/:id").get(authMiddleware, updateOrder);

module.exports = router;
