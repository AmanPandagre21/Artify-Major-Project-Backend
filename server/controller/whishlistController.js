const ErrorHandler = require("../utils/ErrorHandler");
const WishList = require("../model/wishListModel");

// add post to whishlist
exports.addToWhishList = async (req, res, next) => {
  try {
    // get the params id and add post into wishlist collection
    const list = await WishList.findById({ postId: req.params.id });

    res
      .status(200)
      .json({ success: true, message: "Item added into Wishlist", list });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// get all Wishlists item
exports.getAllItemsFromWhishList = async (req, res, next) => {
  try {
    // get all items
    const lists = await WishList.find();

    res.status(200).json({ success: true, lists });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// remove post to whishlist
exports.removeFromWhishList = async (req, res, next) => {
  try {
    // get the params id and delete post from wishlist collection
    await WishList.findByIdAndDelete({ _id: req.params.id });

    res
      .status(200)
      .json({ success: true, message: "Item removed from Wishlist" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
