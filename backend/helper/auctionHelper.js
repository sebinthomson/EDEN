import asyncHandler from "express-async-handler";
import EnglishAuction from "../models/EnglishAuctionModel.js";
import ReverseAuction from "../models/ReverseAuctionModel.js";
import Biddings from "../models/biddingsModel.js";
import Bid from "../models/bidsModel.js";

const newEnglishAuction = asyncHandler(
  async (user, item, quantity, startingBid, startsOn, endsOn, image) => {
    const englishAuction = await EnglishAuction.create({
      user,
      item,
      quantity,
      startingBid,
      startsOn,
      endsOn,
      images: image,
    });
    return await englishAuction.populate("user");
  }
);

const newReverseAuction = asyncHandler(
  async (user, item, quantity, startsOn, endsOn) => {
    const reverseAuction = await ReverseAuction.create({
      user,
      item,
      quantity,
      startsOn,
      endsOn,
    });
    return await reverseAuction.populate("user");
  }
);

const startBidding = asyncHandler(
  async (auctionId, users, isEnglishAuction) => {
    let auctionType;
    isEnglishAuction
      ? (auctionType = "EnglishAuction")
      : (auctionType = "ReverseAuction");
    const bidding = await Biddings.create({
      auctionId: auctionId,
      auctionType: auctionType,
      users: users,
      isEnglishAuction: isEnglishAuction,
    });
    return bidding;
  }
);

const biddingHistory = asyncHandler(async (biddingsId) => {
  const bids = await Bid.find({ biddings: biddingsId })
    .populate("sender", "name email")
    .populate("biddings");
  return bids;
});

export { newEnglishAuction, newReverseAuction, startBidding, biddingHistory };
