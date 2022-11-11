const ErrorHandler = require("../utils/ErrorHandler");
const Order = require("../model/orderModel");
// create Order

exports.createOrder = async (req, res, next) => {
  try {
    const {
      seller,
      shippingInfo,

      orderItem,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const order = await Order.create({
      buyer: req.user._id,
      seller,
      shippingInfo,
      orderItem,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

//get Order by id

exports.getMyOrder = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, {
      orderStatus: "Delivered",
    });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
