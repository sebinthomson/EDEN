import asyncHandler from "express-async-handler";
import EnglishAuction from "../models/EnglishAuctionModel.js";

const newEnglishAuction = asyncHandler(
  async (user, item, quantity, startingBid, startsOn, endsOn, image) => {
    return await EnglishAuction.create({
      user,
      item,
      quantity,
      startingBid,
      startsOn,
      endsOn,
      images: image,
    });
  }
);
export { newEnglishAuction };
