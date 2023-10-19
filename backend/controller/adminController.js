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

const adminListUsers = asyncHandler(async(req,res)=>{
  try {
    const users = await User.find()
    console.log(users,'users')
    res.status(201).json({users})
  } catch (error) {
    console.log(error.message)
  }
})

export {
    authAdmin,
    adminListUsers
}