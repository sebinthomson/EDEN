import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import {
  sendVerificationMailHelper,
  registerUserHelper,
  updatePasswordUserHelper,
} from "../helper/userHelper.js";
import Randomstring from "randomstring";

const sendVerifyMail = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const existEmail = await User.findOne({ email: email });
  if (existEmail) {
    res.status(401);
    throw new Error("Email already exists");
  }

  const otp = Randomstring.generate({ length: 4, charset: "numeric" });
  console.log("Generated OTP for", name, ":", otp);

  req.session = req.session || {};
  req.session.tempOtp = otp;

  sendVerificationMailHelper(name, email, otp);
  return res.status(200).json({ otpSend: true });
});

const forgotPasswordOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const existEmail = await User.findOne({ email: email });
  if (!existEmail) {
    res.status(401);
    throw new Error(`${email} is not a registered email`);
  }

  const otp = Randomstring.generate({ length: 4, charset: "numeric" });
  console.log("Generated OTP for", existEmail.name, ":", otp);

  req.session = req.session || {};
  req.session.tempOtp = otp;

  sendVerificationMailHelper(existEmail.name, email, otp);
  return res.status(200).json({ otpSend: true });
});

const confirmForgotPasswordOTP = asyncHandler(async (req, res) => {
  const { otpPin } = req.body;
  const actualOTP = req.session.tempOtp;
  if (actualOTP === otpPin) {
    res.status(201).json({ message: "OTP Verified" });
  } else {
    res.status(401);
    throw new Error("Error while OTP verification");
  }
});

const changePasswordUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  await updatePasswordUserHelper(email, password);
  let user = await User.findOne({ email, email });
  const token = generateToken(res, user._id);
  await User.updateOne({ email: email }, { token: token });
  user = await User.findOne({ email: email });
  res.status(201).json({
    user: user,
  });
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, otpPin } = req.body;
  const actualOTP = req.session.tempOtp;
  if (actualOTP === otpPin) {
    let user = await registerUserHelper(name, email, password);
    res.status(201).json({ user: user });
    const token = generateToken(res, user._id);
    await User.updateOne({ email: email }, { token: token });
    user = await User.findOne({ email: email });
  } else {
    res.status(401);
    throw new Error("Error while creating user");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email: email });

  if (user && (await user.matchPassword(password))) {
    if (user.isBlocked) {
      res.status(403);
      throw new Error("User Blocked");
    } else {
      const token = generateToken(res, user._id);
      await User.updateOne({ email: email }, { token: token });
      user = await User.findOne({ email: email });
      res.status(201).json({
        user: user,
      });
    }
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const oAuthLoginUser = asyncHandler(async (req, res) => {
  const { name, email, oAuthLogin } = req.body;
  let user = await User.findOne({ email: email });

  if (user) {
    const token = generateToken(res, user._id);
    await User.updateOne({ email: email }, { token: token });
    user = await User.findOne({ email: email });
    res.status(201).json({
      user: user,
    });
  } else if (!user) {
    let user = registerUserHelper(name, email, oAuthLogin);
    const token = generateToken(res, user._id);
    await User.updateOne({ email: email }, { token: token });
    user = await User.findOne({ email: email });
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

export {
  sendVerifyMail,
  registerUser,
  loginUser,
  oAuthLoginUser,
  logoutUser,
  forgotPasswordOTP,
  confirmForgotPasswordOTP,
  changePasswordUser,
};
