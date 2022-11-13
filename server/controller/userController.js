const User = require("../model/userModel");
const Posts = require("../model/postsModel");
const { generateHash } = require("../services/hash-services");
const { generateOtp, verifyOtp } = require("../services/otp-services");
const {
  generateHashPassword,
  compareHashPassword,
} = require("../services/password-services");
const { generateTokens } = require("../services/token-services");
const sendEmail = require("../utils/sendMail");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");

/* ------- User Registration ---------*/

exports.registration = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  // check attributes are not null
  if (!name && !email && !password && !confirmPassword) {
    return next(new ErrorHandler("All Fields are Mandatory", 400));
  }

  // check password or confirm password are some or not
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password and Confirm Password are not matched", 400)
    );
  }

  try {
    // create hashed password
    const hashedPassword = await generateHashPassword(password);

    // add user data into db
    const userInfo = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // generate access token
    const accessToken = await generateTokens({ _id: userInfo._id });

    res.status(200).json({ success: true, token: accessToken });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

/* ------- User Login ---------*/

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // check attributes are not null
  if (!email && !password) {
    return next(new ErrorHandler("All Fields are Mandatory", 400));
  }
  try {
    //get data form the database
    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("You are not a Registered User", 400));
    }

    // check password are correct or not
    const verify = await compareHashPassword(password, user.password);

    if (!verify) {
      return next(new ErrorHandler("Incorret Password", 400));
    }

    // generate access token
    const accessToken = await generateTokens({ _id: user._id });

    res.status(200).json({ success: true, token: accessToken });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

/* ------- Forgot Password Controllers ---------*/

// send otp
exports.sendOTP = async (req, res, next) => {
  try {
    //get data from body
    const { email } = req.body;

    if (!email) {
      return next(new ErrorHandler("Email field is empty", 400));
    }

    //check that email is registered email or not
    const user = await User.findOne({ email });
    if (!user) return next(new ErrorHandler("Email Not registered", 400));

    //generate otp
    const otp = await generateOtp();

    // hash otp
    const time = 1000 * 60 * 1; // 1 min
    const expireTime = Date.now() + time;
    const data = `${email}.${otp}.${expireTime}`;
    const hash = await generateHash(data);

    const message = `Your password reset OTP is :- \n\n ${otp} \n\nIf you have not requested this email then, please ignore it.`;

    // send otp to mail
    await sendEmail({
      email: user.email,
      subject: "Artify Password Recovery Mail",
      message,
    });

    res
      .status(200)
      .json({ success: true, hash: `${hash}.${expireTime}`, email, otp });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// verify otp
exports.verifyOTP = async (req, res, next) => {
  try {
    //get data from body
    const { otp, hash, email } = req.body;

    if (!otp && !hash && !email) {
      return next(new ErrorHandler("OTP field is empty", 400));
    }

    //   extract the otp hash and expire time from hash
    const [hashedData, expireTime] = hash.split(".");

    if (Date.now() > expireTime) {
      return next(new ErrorHandler("OTP has expired", 400));
    }

    // hash otp
    const data = `${email}.${otp}.${expireTime}`;
    const isValid = await verifyOtp(data, hashedData);

    //check that otp is corect or not
    if (!isValid) {
      return next(new ErrorHandler("Wrong OTP", 400));
    }

    res.status(200).json({ success: true, email });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// resetPassword
exports.resetPassword = async (req, res, next) => {
  try {
    //get data from body
    const { password, confirmPassword, email } = req.body;

    if (!password && !confirmPassword && !email) {
      return next(new ErrorHandler("All fields are Mandatory", 400));
    }

    // check password or confirm password are some or not
    if (password !== confirmPassword) {
      return next(
        new ErrorHandler("Password and Confirm Password are not matched", 400)
      );
    }

    // create hashed password
    const hashedPassword = await generateHashPassword(password);

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("You are not a Registered User", 400));
    }

    // save user new password
    user.password = hashedPassword;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password Reset Successfully" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

/* ------- Change Password ---------*/

exports.changePassword = async (req, res, next) => {
  try {
    // get user details
    const user = await User.findById(req.user._id).select("+password");

    //get data from body
    const { oldPassword, password, confirmPassword } = req.body;

    if (!password || !confirmPassword || !oldPassword) {
      return next(new ErrorHandler("All fields are Mandatory", 400));
    }

    // check old password is correct or not
    const isMatched = await compareHashPassword(oldPassword, user.password);
    if (!isMatched) {
      return next(new ErrorHandler("Wrong Old Password", 400));
    }

    // check password or confirm password are some or not
    if (password !== confirmPassword) {
      return next(
        new ErrorHandler("Password and Confirm Password are not matched", 400)
      );
    }

    // create hashed password
    const hashedNewPassword = await generateHashPassword(password);

    // save user new password
    user.password = hashedNewPassword;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password Reset Successfully" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

/* ------- Get User Profile ---------*/

exports.profile = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      return next(new ErrorHandler("Cannot fetched Data", 404));
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

/* ------- Get Users ---------*/

exports.userProfiles = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users) {
      return next(new ErrorHandler("Cannot fetched Data", 404));
    }

    res.status(200).json({ success: true, users });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

/* ------- Update Profile ---------*/

exports.updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const { name, number, bio } = req.body;
    // console.log(req.file.avatar.tempFilePath);
    const avatar = req.files.avatar.tempFilePath;

    if (name) user.name = name;

    if (number) user.phone = Number(number);

    if (bio) user.bio = bio;

    if (!avatar) {
      await user.save();
    } else {
      if (user.avatar.public_id && avatar) {
        await cloudinary.v2.uploader.destroy(
          user.avatar.public_id && user.avatar.public_id
        );
      }

      const mycloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "artify/avatars",
      });

      fs.rmSync("./tmp", { recursive: true });

      user.avatar = {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      };

      await user.save();
    }

    res.status(200).json({ success: true, message: "Profile Updated", user });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

/* ------- My Posts ---------*/

exports.getMyPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const posts = [];

    for (let i = 0; i < user.posts.length; i++) {
      const post = await Posts.findById(user.posts[i]).populate(
        "artist category likes"
      );
      posts.push(post);
    }

    res.status(200).json({ success: true, posts });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

/* ------- get Artist Profile ---------*/

exports.getArtistProfile = async (req, res, next) => {
  try {
    const artist = await User.findById(req.params.id).populate("posts");

    if (!artist) {
      return next(new ErrorHandler("Artist not found", 400));
    }

    res.status(200).json({ success: true, artist });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

/* ------- get Artist Profile Posts ---------*/

exports.getArtistPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    const posts = [];

    for (let i = 0; i < user.posts.length; i++) {
      const post = await Posts.findById(user.posts[i]).populate(
        "artist category likes"
      );
      posts.push(post);
    }

    res.status(200).json({ success: true, posts });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

/* ------- contact form ---------*/

exports.reportQuery = async (req, res, next) => {
  try {
    const { name, number, email, query } = req.body;

    const message = `Name = ${name} email = ${email} number = ${number} Query = ${query}`;
    // send otp to mail
    await sendEmail({
      email: "gehloth03@gmail.com",
      subject: "Artify User Query Mail",
      message,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
