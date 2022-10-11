const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPost,
  likeAndUnlike,
  updateTitleAndDescription,
  deletePost,
} = require("../controller/postController");

router.route("/create-post").post(authMiddleware, createPost);

router
  .route("/post:id")
  .get(authMiddleware, likeAndUnlike)
  .put(authMiddleware, updateTitleAndDescription)
  .delete(authMiddleware, deletePost);

module.exports = router;
