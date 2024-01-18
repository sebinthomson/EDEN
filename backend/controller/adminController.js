import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Auctioneer from "../models/auctioneerModel.js";
import generateToken from "../utils/generateToken.js";
import EnglishAuction from "../models/englishAuctionModel.js";
import ReverseAuction from "../models/reverseAuctionModel.js";

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email: email, isAdmin: true });
  if (user && (await user.matchPassword(password))) {
    const token = generateToken(res, user._id);
    await User.updateOne({ email: email }, { token: token });
    user = await User.findOne({ email: email });
    res.status(201).json({
      admin: user,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const listUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false });
    res.status(201).json(users);
  } catch (error) {
    console.log(error.message);
  }
});

const blockUnblockUser = asyncHandler(async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.body.userId },
      { isBlocked: req.body.block }
    );
    res
      .status(200)
      .json({ message: "User Profile Blocked Successfully", task: true });
  } catch (error) {
    res
      .status(200)
      .json({ message: "User Profile Blocking Failed", task: false });
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

const adminGetUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.find({ _id: req.body.user });
    res.status(200).json({ user });
  } catch (error) {
    console.log(error.message);
  }
});

const adminDashboard = asyncHandler(async (req, res) => {
  try {
    const aggregateTotalQuantity = async (auctionModel) => {
      try {
        const result = await auctionModel.aggregate([
          {
            $match: {
              winningBid: { $ne: -1 },
            },
          },
          {
            $group: {
              _id: { $toLower: "$item" },
              totalQuantity: { $sum: "$quantity" },
            },
          },
        ]);
        const itemQuantities = result.map((item) => ({
          id: item._id,
          value: item.totalQuantity,
        }));

        return itemQuantities;
      } catch (error) {
        console.error("Error aggregating total quantity:", error);
        throw error;
      }
    };

    const calculateTotalQuantity = async (auctionModel) => {
      try {
        const result = await auctionModel.aggregate([
          {
            $match: {
              winningBid: { $ne: -1 },
            },
          },
          {
            $group: {
              _id: { endsOn: "$endsOn" },
              quantity: { $sum: "$quantity" },
            },
          },
          {
            $project: {
              _id: 0,
              date: {
                $dateToString: {
                  date: "$_id.endsOn",
                  format: "%d-%m-%Y", // You can customize the format
                },
              },
              quantity: 1,
            },
          },
          {
            $sort: { date: 1 },
          },
        ]);

        return result;
      } catch (error) {
        console.error("Error calculating total quantity:", error);
        throw error;
      }
    };

    const englishAuctionItemQuantities = await aggregateTotalQuantity(
      EnglishAuction
    );
    const reverseAuctionItemQuantities = await aggregateTotalQuantity(
      ReverseAuction
    );

    const englishAuctionTotalQuantity = await calculateTotalQuantity(
      EnglishAuction
    );
    const reverseAuctionTotalQuantity = await calculateTotalQuantity(
      ReverseAuction
    );
    const profit = await calculateSumOfWinningBid();
    const users = await User.find().count();
    const auctioneers = await Auctioneer.find().count();
    const EA = `${await EnglishAuction.find({
      winningBid: { $ne: -1 },
    }).count()}/${await EnglishAuction.find().count()}`;
    const RA = `${await ReverseAuction.find({
      winningBid: { $ne: -1 },
    }).count()}/${await ReverseAuction.find().count()}`;
    res.status(200).json({
      englishAuctionItemQuantities,
      reverseAuctionItemQuantities,
      englishAuctionTotalQuantity,
      reverseAuctionTotalQuantity,
      profit,
      users,
      auctioneers,
      EA,
      RA,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

const calculateSumOfWinningBid = async () => {
  try {
    const englishAuctionSum = await EnglishAuction.aggregate([
      {
        $match: {
          winningBid: { $ne: -1 },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$winningBid" },
        },
      },
    ]);
    const reverseAuctionSum = await ReverseAuction.aggregate([
      {
        $match: {
          winningBid: { $ne: -1 },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$winningBid" },
        },
      },
    ]);
    const sumEnglishAuction =
      englishAuctionSum.length > 0 ? englishAuctionSum[0].total : 0;
    const sumReverseAuction =
      reverseAuctionSum.length > 0 ? reverseAuctionSum[0].total : 0;
    const totalSum = 0.02 * (sumEnglishAuction + sumReverseAuction);
    return totalSum.toFixed(2);
  } catch (error) {
    console.error("Error calculating sum: ", error);
  }
};

export {
  loginAdmin,
  listUsers,
  blockUnblockUser,
  adminSearchUsers,
  adminDeleteUser,
  adminEditUser,
  adminGetUser,
  adminDashboard,
};
