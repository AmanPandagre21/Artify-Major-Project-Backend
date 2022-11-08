const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  checkout,
  sendStripeApiKey,
} = require("../controller/PaymentController");

router.route("/payment/process").post(authMiddleware, checkout);

router.route("/stripeapikey").get(authMiddleware, sendStripeApiKey);

module.exports = router;
