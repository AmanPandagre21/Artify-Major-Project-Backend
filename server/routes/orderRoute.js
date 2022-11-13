const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createOrder,
  getMyOrder,
  updateOrder,
  getMyOrderHistory,
} = require("../controller/orderController");

router.route("/order/new").post(authMiddleware, createOrder);

router.route("/my-orders").get(authMiddleware, getMyOrder);

router.route("/orders-history").get(authMiddleware, getMyOrderHistory);

router.route("/update-order/:id").put(authMiddleware, updateOrder);

module.exports = router;
