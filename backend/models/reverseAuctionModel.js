import mongoose from "mongoose";
import User from "./userModel.js";

const reverseAuctionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User
    },
    item: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    startsOn: {
      type: Date,
      required: true,
    },
    endsOn: {
      type: Date,
      required: true,
    },
    biddingHistory: {
      type: [
        {
          biddingAmount: {
            type: Number,
            min: 0,
          },
          biddingTime: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    review: {
      type: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
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
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ReverseAuction = mongoose.model("ReverseAuction", reverseAuctionSchema);

export default ReverseAuction;
