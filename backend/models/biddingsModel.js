import mongoose, { mongo } from "mongoose";

const auctionBidding = mongoose.Schema(
  {
    auctionId: { type: mongoose.Schema.Types.ObjectId },
    isEnglishAuction: { type: Boolean, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bid",
    },
  },
  { timestamps: true }
);

const Biddings = mongoose.model("Biddings", auctionBidding);

export default Biddings;
