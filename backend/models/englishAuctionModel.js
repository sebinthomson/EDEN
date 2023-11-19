import mongoose from "mongoose";

const englishAuctionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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

const EnglishAuction = mongoose.model("EnglishAuction", englishAuctionSchema);

export default EnglishAuction;
