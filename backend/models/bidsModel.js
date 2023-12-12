import mongoose from "mongoose";

const bidsSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: Number, trim: true },
    biddings: { type: mongoose.Schema.Types.ObjectId, ref: "Biddings" },
    // readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Bid = mongoose.model("Bid", bidsSchema);
export default Bid;
