import asyncHandler from "express-async-handler";
import Auctioneer from "../models/auctioneerModel.js";
import User from "../models/userModel.js";

const upsertAuctioneer = asyncHandler(
  async (user, mobileNumber, location, filename) => {
    const auctioneer = await Auctioneer.find({ user: user });
    if (auctioneer.length > 0) {
      await Auctioneer.updateOne({
        user: user,
        mobileNumber: Number(mobileNumber) || auctioneer[0].mobileNumber,
        location: location || auctioneer[0].location,
        profileImage: filename || auctioneer[0].profileImage,
      });
    } else {
      await Auctioneer.create({
        user,
        mobileNumber,
        location,
        profileImage: filename,
      });
      await User.updateOne({ _id: user }, { auctioneer: true });
    }
    return await Auctioneer.find({ user: user }).populate("user");
  }
);

export { upsertAuctioneer };
