import asyncHandler from "express-async-handler";
import Auctioneer from "../models/auctioneerModel.js";
import { upsertAuctioneer } from "../helper/auctioneerHelper.js";

const loadAuctioneerProfile = asyncHandler(async (req, res) => {
  const auctioneer = await Auctioneer.find({ user: req.query.userId }).populate(
    "user"
  );
  if (auctioneer.length > 0) {
    res.status(200).json(auctioneer);
  } else {
    res.status(200).json({ auctioneer: "Not Found" });
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

export { loadAuctioneerProfile, profileUpdate, listAuctioneers };
