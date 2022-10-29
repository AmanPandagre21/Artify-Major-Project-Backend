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
  updateUserProfile,
  getMyPosts,
  getArtistProfile,
  getArtistPosts,
} = require("../controller/userController");

router.route("/register").post(registration);

router.route("/login").post(login);

router.route("/send-otp").post(sendOTP);

router.route("/verify-otp").post(verifyOTP);

router.route("/resetPassword").put(resetPassword);

router.route("/me").get(authMiddleware, profile);

router.route("/me/update-profile").put(authMiddleware, updateUserProfile);

router.route("/me/change-password").put(authMiddleware, changePassword);

router.route("/artists-profiles").get(userProfiles);

router.route("/my/posts").get(authMiddleware, getMyPosts);

router.route("/artist-posts/:id").get(authMiddleware, getArtistPosts);

router.route("/artist/:id").get(authMiddleware, getArtistProfile);

module.exports = router;
