import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const adminListUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false });
    res.status(201).json({ users });
  } catch (error) {
    console.log(error.message);
  }
});

const adminSearchUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({
      name: { $regex: req.body.search, $options: "i" },
      isAdmin: false,
    });
    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
  }
});

const adminDeleteUser = asyncHandler(async (req, res) => {
  try {
    await User.deleteOne({ _id: req.body.userId });
    res
      .status(200)
      .json({ message: "User Profile Deleted Successfully", task: true });
  } catch (error) {
    console.log(error.message);
    res
      .status(200)
      .json({ message: "User Profile Delete Failed", task: false });
  }
});

const adminEditUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.body._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
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
    res.status(200).json({ message: "hello world" });
  } catch (error) {
    console.log(error.message);
  }
});

const adminGetUser = asyncHandler(async(req,res)=>{
  try {
    const user = await User.find({_id: req.body.user})
    res.status(200).json({user})
  } catch (error) {
    console.log(error.message)
  }
})

export {
  authAdmin,
  adminListUsers,
  adminSearchUsers,
  adminDeleteUser,
  adminEditUser,
  adminGetUser
};
