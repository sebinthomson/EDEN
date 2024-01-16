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

const englishAuctionSchema = mongoose.Schema(
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
    startingBid: {
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
    images: {
      type: Array,
      required: true,
    },
    paymentType: {
      type: String,
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

const EnglishAuction = mongoose.model("EnglishAuction", englishAuctionSchema);

export default EnglishAuction;
