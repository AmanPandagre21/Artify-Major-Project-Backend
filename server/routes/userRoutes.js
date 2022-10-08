const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  registration,
  login,
  sendOTP,
  verifyOTP,
  resetPassword,
  changePassword,
  userProfiles,
  profile,
} = require("../controller/userController");

router.route("/register").post(registration);

router.route("/login").post(login);

router.route("/send-otp").post(sendOTP);

router.route("/verify-otp").post(verifyOTP);

router.route("/resetPassword").put(resetPassword);

router.route("/me").get(authMiddleware, profile);

// router.route("/me/update-profile").put(authMiddleware, updateProfile);

router.route("/me/change-password").get(authMiddleware, changePassword);

router.route("/artists-profiles").get(userProfiles);

// router.route("/my/posts").get(authMiddleware, getMyPosts);

// router.route("/artist-posts/:id").get(authMiddleware, getUserPosts);

// router.route("/artist/:id").get(authMiddleware, getUserProfile);

module.exports = router;
