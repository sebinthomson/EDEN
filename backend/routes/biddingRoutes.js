import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createAuctionBidding,
  biddingHistory,
  bid,
  addToAuctionBidding
} from "../controller/auctionController.js";

const router = express.Router();

router.post("/auctionbidding", createAuctionBidding);
// router.put("/auctionbiddingremove", protect, removeFromAuctionBidding);
router.post("/auctionbiddingadd", protect, addToAuctionBidding);

router.get("/:AuctionId", protect, biddingHistory);
router.post("/", bid);

export default router;
