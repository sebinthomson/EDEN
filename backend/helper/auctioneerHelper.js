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

const auctioneerReviews = asyncHandler(async () => {
  return await Auctioneer.aggregate([
    {
      $lookup: {
        from: "englishauctions",
        localField: "user",
        foreignField: "user",
        as: "englishAuctions",
      },
    },
    {
      $lookup: {
        from: "reverseauctions",
        localField: "user",
        foreignField: "user",
        as: "reverseAuctions",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $project: {
        _id: 1,
        user: {
          _id: "$userDetails._id",
          name: "$userDetails.name",
          email: "$userDetails.email",
          auctioneer: "$userDetails.auctioneer",
          auctions: {
            $concatArrays: [
              {
                $map: {
                  input: "$englishAuctions",
                  as: "ea",
                  in: {
                    _id: "$$ea._id",
                    item: "$$ea.item",
                    quantity: "$$ea.quantity",
                    startingBid: "$$ea.startingBid",
                    winningBid: "$$ea.winningBid",
                    reviews: "$$ea.review",
                    startsOn: "$$ea.startsOn",
                    endsOn: "$$ea.endsOn",
                    images: "$$ea.images",
                    english: true,
                  },
                },
              },
              {
                $map: {
                  input: "$reverseAuctions",
                  as: "ra",
                  in: {
                    _id: "$$ra._id",
                    item: "$$ra.item",
                    quantity: "$$ra.quantity",
                    winningBid: "$$ra.winningBid",
                    reviews: "$$ra.review",
                    startsOn: "$$ra.startsOn",
                    endsOn: "$$ra.endsOn",
                    english: false,
                  },
                },
              },
            ],
          },
        },
        rating: 1,
        mobileNumber: 1,
        location: 1,
        profileImage: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);
});

export { upsertAuctioneer, auctioneerReviews };
