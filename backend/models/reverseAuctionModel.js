import mongoose from "mongoose";
import User from "./userModel.js";

const reviewSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  rating: {
    type: Number,
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
});

const reverseAuctionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User,
    },
    item: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    winningBid: {
      type: Number,
      default: -1,
    },
    startsOn: {
      type: Date,
      required: true,
    },
    endsOn: {
      type: Date,
      required: true,
    },
    review: {
      type: [reviewSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ReverseAuction = mongoose.model("ReverseAuction", reverseAuctionSchema);

export default ReverseAuction;
