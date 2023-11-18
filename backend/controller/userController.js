import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import {
  sendVerificationMailHelper,
  registerUserHelper,
} from "../helper/userHelper.js";
import Randomstring from "randomstring";
import session from "express-session";

const sendVerifyMail = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const existEmail = await User.findOne({ email: email });
  if (existEmail) {
    return res.status(400).json({ error: "Email already exists." });
  }

  const otp = Randomstring.generate({ length: 4, charset: "numeric" });
  console.log("Generated OTP", otp);

  req.session = req.session || {};
  req.session.tempOtp = otp;

  sendVerificationMailHelper(name, email, otp);
  return res.status(200).json({ otpSend: true });
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, otpPin } = req.body;
  const actualOTP = req.session.tempOtp;
  if (actualOTP === otpPin) {
    const user = await registerUserHelper(name, email, password);
    console.log(user);
    res.status(201).json({ user: user });
  } else {
    res.status(401);
    throw new Error("Error while creating user");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      user: user,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const oAuthLoginUser = asyncHandler(async (req, res) => {
  const { name, email, oAuthLogin } = req.body;
  const user = await User.findOne({ email: email });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      user: user,
    });
  } else if (!user) {
    const user = await registerUserHelper(name, email, oAuthLogin);
    generateToken(res, user._id);
    res.status(201).json({
      user: user,
    });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User Logged Out", logout: true });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  res.status(200).json(user);
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) user.password = req.body.password;
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserImage = asyncHandler(async (req, res) => {
  try {
    if (req.file) {
      User.findByIdAndUpdate(
        { _id: req.body.id },
        { profileImage: req.file.filename }
      ).catch((err) => {
        console.log(err.message);
      });
      res.status(200).json({ profileImage: req.file.filename });
    }
  } catch (error) {
    console.log(error.message);
  }
});

export {
  sendVerifyMail,
  registerUser,
  loginUser,
  oAuthLoginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateUserImage,
};
