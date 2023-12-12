import mongoose from "mongoose";
import User from "./userModel.js";

const auctioneerSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User,
    },
    rating: {
      type: Number,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "default.png",
    },
  },
  {
    timestamps: true,
  }
);

const Auctioneer = mongoose.model("Auctioneer", auctioneerSchema);

export default Auctioneer;
