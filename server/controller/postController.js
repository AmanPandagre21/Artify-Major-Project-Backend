const Posts = require("../model/postsModel");
const User = require("../model/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary");
const fs = require("fs");
const ApiFeature = require("../utils/ApiFeature");
const axios = require("axios");
const imagePrediction = require("../utils/imagePredictor");
const TeachableMachine = require("@sashido/teachablemachine-node");

const model = new TeachableMachine({
  modelUrl: "https://teachablemachine.withgoogle.com/models/UOr4hlqlP/",
});

// create Post
exports.createPost = async (req, res, next) => {
  try {
    const { title, description, category, isForSell, amount, imgUrl } =
      req.body;

    const image = req.files.image.tempFilePath;

    if (!title || !description || !category) {
      return next(new ErrorHandler("Required Field", 400));
    }

    const myCloud = await cloudinary.v2.uploader.upload(image, {
      folder: "artify/posts",
    });

    const predict = await imgFunc(myCloud.secure_url);

    if (predict.predictions[0].class === "NonSensitive") {
      fs.rmSync("./tmp", { recursive: true });

      const postData = {
        title,
        description,
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        category,
        artist: req.user._id,
        amount: 0,
      };
      if (isForSell) {
        if (!amount) {
          return next(new ErrorHandler("amount is required", 400));
        }
        postData.amount = amount;
      }
      const post = await Posts.create(postData);
      const user = await User.findById(req.user._id);
      user.posts.unshift(post._id);
      user.save();
    } else {
      await cloudinary.v2.uploader.destroy(myCloud.public_id);
      return next(
        new ErrorHandler("Image is " + predict.predictions[0].class, 400)
      );
    }

    res.status(201).json({
      success: true,
      message: "Post created",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 503));
  }
};

const imgFunc = async (imgUrl) => {
  try {
    const { data } = await axios.post(
      "https://artify-major-project-backend-production.up.railway.app/api/v1/imageprediction",
      { imgUrl: imgUrl },
      { headers: { "Content-Type": "application/json" } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

// get Posts
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Posts.find()
      .sort({ createdAt: -1 })
      .populate("artist category likes");

    res.status(201).json({
      success: true,
      posts,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// get Posts
exports.getPostsBySearch = async (req, res, next) => {
  try {
    const apiFeature = new ApiFeature(Posts.find(), req.query).search();
    const posts = await apiFeature.query;
    res.status(201).json({
      success: true,
      posts,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

//get Post Details
exports.postDetails = async (req, res, next) => {
  try {
    const post = await Posts.findById(req.params.id).populate(
      "artist category likes"
    );
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      post: post,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// update Post
exports.updatePost = async (req, res, next) => {
  try {
    const post = await Posts.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.artist.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    post.title = req.body.title;
    post.description = req.body.description;

    if (req.body.outOfStock) {
      post.outOfStock = true;
    } else {
      post.outOfStock = false;
    }

    await post.save();
    res.status(200).json({
      success: true,
      message: "Post updated",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// like and unlike Post
exports.likeAndUnlike = async (req, res, next) => {
  try {
    const post = await Posts.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.likes.includes(req.user._id)) {
      const index = post.likes.indexOf(req.user._id);

      post.likes.splice(index, 1);

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post Unliked",
      });
    } else {
      post.likes.push(req.user._id);

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post Liked",
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// delete Post
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Posts.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.artist.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    await cloudinary.v2.uploader.destroy(post.image.public_id);

    await post.remove();

    const user = await User.findById(req.user._id);

    const index = user.posts.indexOf(req.params.id);
    user.posts.splice(index, 1);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
