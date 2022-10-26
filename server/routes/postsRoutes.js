const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPost,
  likeAndUnlike,
  updatePost,
  deletePost,
  getPosts,
} = require("../controller/postController");

router.route("/me/create-post").post(authMiddleware, createPost);

router.route("/posts").get(authMiddleware, getPosts);

router
  .route("/post/:id")
  .get(authMiddleware, likeAndUnlike)
  .put(authMiddleware, updatePost)
  .delete(authMiddleware, deletePost);

module.exports = router;
