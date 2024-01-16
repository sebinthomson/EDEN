import asyncHandler from "express-async-handler";
import Auctioneer from "../models/auctioneerModel.js";
import {
  auctioneerReviews,
  upsertAuctioneer,
} from "../helper/auctioneerHelper.js";
import EnglishAuction from "../models/EnglishAuctionModel.js";
import ReverseAuction from "../models/ReverseAuctionModel.js";

const loadAuctioneerProfile = asyncHandler(async (req, res) => {
  try {
    let auctioneer = await Auctioneer.find({ user: req.query.userId }).populate(
      "user"
    );
    let reviews = await auctioneerReviews();
    reviews = reviews.filter((review) => {
      if (review.user._id == req.query.userId) return review?.user?.auctions;
    });
    reviews = reviews[0].user.auctions;
    if (auctioneer.length > 0) {
      res.status(200).json({ auctioneer, reviews });
    } else {
      res.status(200).json({ auctioneer: "Not Found" });
    }
  } catch (error) {
    console.log(error.message);
    throw new Error("Auctioneer Details not found");
  }
});

const profileUpdate = asyncHandler(async (req, res) => {
  const { id, mobileNumber, location } = req.body;
  let filename;
  if (req.file) {
    filename = req.file.filename;
  }
  const auctioneer = await upsertAuctioneer(
    id,
    mobileNumber,
    location,
    filename
  );
  res.status(200).json(auctioneer);
});

const listAuctioneers = asyncHandler(async (req, res) => {
  try {
    const users = await Auctioneer.find().populate("user");
    res.status(201).json(users);
  } catch (error) {
    console.log(error.message);
  }
});

const listAuctioneersUser = asyncHandler(async (req, res) => {
  try {
    const users = await auctioneerReviews();
    res.status(201).json(users);
  } catch (error) {
    console.log(error.message);
  }
});

export {
  loadAuctioneerProfile,
  profileUpdate,
  listAuctioneers,
  listAuctioneersUser,
};
