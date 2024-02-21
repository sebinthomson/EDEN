import asyncHandler from "express-async-handler";
import Auctioneer from "../models/auctioneerModel.js";
import {
  auctioneerReviews,
  upsertAuctioneer,
} from "../helper/auctioneerHelper.js";
import cloudinary from "../config/cloudinary.js";

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
  try {
    const { id, mobileNumber, location, image } = req.body;
    const result = await cloudinary.uploader.upload(image, {
      folder: "AuctioneerProfilePic",
    });
    let filename = result.secure_url;
    const auctioneer = await upsertAuctioneer(
      id,
      mobileNumber,
      location,
      filename
    );
    res.status(200).json(auctioneer);
  } catch (error) {
    console.log(error.message);
    throw new Error("Error updating auctioneer profile");
  }
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
