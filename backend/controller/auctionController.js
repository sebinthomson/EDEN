import asyncHandler from "express-async-handler";
import {
  newEnglishAuction,
  newReverseAuction,
  startBidding,
  biddingHistory as biddingHistoryHelper,
} from "../helper/auctionHelper.js";
import EnglishAuction from "../models/EnglishAuctionModel.js";
import ReverseAuction from "../models/ReverseAuctionModel.js";
import Biddings from "../models/biddingsModel.js";
import Bid from "../models/bidsModel.js";
import User from "../models/userModel.js";

const newEnglishAuctionUser = asyncHandler(async (req, res) => {
  const { user, item, quantity, startingBid, startsOn, endsOn } = req.body;
  const image = [];
  for (let obj of req.files) {
    image.push(obj.filename);
  }
  const auction = await newEnglishAuction(
    user,
    item,
    quantity,
    startingBid,
    startsOn,
    endsOn,
    image
  );
  res.status(200).json({ newEnglishAuction: auction });
});

const newReverseAuctionUser = asyncHandler(async (req, res) => {
  const { userId, item, quantity, startDate, endDate } = req.body;
  const auction = await newReverseAuction(
    userId,
    item,
    quantity,
    startDate,
    endDate
  );
  res.status(200).json({ newReverseAuction: auction });
});

const listAuctionUser = asyncHandler(async (req, res) => {
  const englishAuctions = await EnglishAuction.find().populate("user");
  const reverseAuctions = await ReverseAuction.find().populate("user");
  res.status(200).json({ auctions: { englishAuctions, reverseAuctions } });
});

const listEnglishAuctionsAdmin = asyncHandler(async (req, res) => {
  try {
    const allAuctions = await EnglishAuction.find().populate("user");
    res.status(201).json(allAuctions);
  } catch (error) {
    console.log(error.message);
  }
});

const listReverseAuctionsAdmin = asyncHandler(async (req, res) => {
  try {
    const allAuctions = await ReverseAuction.find().populate("user");
    res.status(201).json(allAuctions);
  } catch (error) {
    console.log(error.message);
  }
});

const createAuctionBidding = asyncHandler(async (req, res) => {
  try {
    const bidding = await startBidding(
      req.body.auctionId,
      req.body.name,
      JSON.parse(req.body.user),
      req.body.isEnglishAuction
    );
    res.status(200).json(bidding);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const biddingHistory = asyncHandler(async (req, res) => {
  try {
    const bidding = await Biddings.find({ auctionId: req.params.AuctionId });
    const bidsHistory = await biddingHistoryHelper(bidding[0]?._id);
    if (bidsHistory.length) {
      res.json(bidsHistory);
    } else {
      res.json({ noBidHistory: true, bidding: bidding[0] });
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const bid = asyncHandler(async (req, res) => {
  const { content, auctionId } = req.body;
  const bidding = await Biddings.find({ auctionId: auctionId });
  const newBid = {
    sender: req.body.senderId,
    content: content,
    biddings: bidding[0]._id.toString(),
  };

  try {
    let bid = await Bid.create(newBid);
    bid = await Bid.populate(bid, { path: "sender", select: "name email" });
    bid = await Bid.populate(bid, { path: "biddings", select: "auctionName" });
    await Biddings.findByIdAndUpdate(bidding[0]._id.toString(), {
      latestMessage: bid._id.toString(),
    });
    await Biddings.findByIdAndUpdate(bidding[0]._id.toString(), {
      latestMessage: bid._id.toString(),
    });
    res.json(bid);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const addToAuctionBidding = asyncHandler(async (req, res) => {
  const { userId, auctionId } = req.body;
  let bidding;
  bidding = await Biddings.findOneAndUpdate(
    { auctionId: auctionId },
    {
      $push: { users: userId },
    }
  );
  if (!bidding) {
    let englishAuction = false;
    if ((await ReverseAuction.find({ _id: auctionId })).length == 0) {
      await EnglishAuction.find({ _id: auctionId });
      englishAuction = true;
    }
    bidding = await startBidding(auctionId, userId, englishAuction);
  }
  if (!bidding) {
    res.status(404);
    throw new Error("AuctionId not found");
  } else {
    res.json(bidding);
  }
});

export {
  newEnglishAuctionUser,
  newReverseAuctionUser,
  listAuctionUser,
  listEnglishAuctionsAdmin,
  listReverseAuctionsAdmin,
  createAuctionBidding,
  biddingHistory,
  bid,
  addToAuctionBidding,
};
