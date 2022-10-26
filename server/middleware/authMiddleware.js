const { verifyAccessToken } = require("../services/token-services");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../model/userModel");

module.exports = async (req, res, next) => {
  try {
    let accessToken;

    const { authorization } = req.headers;

    if (authorization && authorization.startsWith("Bearer")) {
      accessToken = authorization.split(" ")[1];

      if (!accessToken) {
        throw new Error();
      }

      const userData = await verifyAccessToken(accessToken);

      if (!userData) {
        throw new Error();
      }

      req.user = await User.findById(userData._id);
      next();
    } else {
      return next(new ErrorHandler("Unauthorized User", 401));
    }
  } catch (error) {
    return next(new ErrorHandler("Invalid Token", 401));
  }
};
