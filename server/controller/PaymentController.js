const ErrorHandler = require("../utils/ErrorHandler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../model/orderModel");

//
exports.checkout = async (req, res, next) => {
  try {
    const { amount } = req.body.amount;
    if (!amount) {
      return next(new ErrorHandler("please enter amount", 400));
    }
    const myPayment = await stripe.paymentIntents.create({
      amount: Math.round(),
      currency: "INR",
      payment_method_types: ["card"],
    });
    res.status(200).json({
      success: true,
      clientSecret: myPayment.client_secret,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

exports.sendStripeApiKey = async (req, res, next) => {
  res.status(200).json({
    success: true,
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
};
