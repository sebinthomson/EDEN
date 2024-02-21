import express from "express";
import {
  sendVerifyMail,
  registerUser,
  loginUser,
  oAuthLoginUser,
  logoutUser,
  forgotPasswordOTP,
  confirmForgotPasswordOTP,
  changePasswordUser,
} from "../controller/userController.js";
import {
  newEnglishAuctionUser,
  newReverseAuctionUser,
  listAuctionUser,
  razorpay,
  razorpayvalidate,
  filterAuctions,
  review,
} from "../controller/auctionController.js";
import {
  listAuctioneersUser,
  loadAuctioneerProfile,
  profileUpdate,
} from "../controller/auctioneerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { englishAuctionUpload, profileUpdateUpload } from "../config/multer.js";

const router = express.Router();

router.post("/sendVerifyMail", sendVerifyMail);
router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.post("/forgotPasswordOTP", forgotPasswordOTP);
router.post("/confirmForgotPasswordOTP", confirmForgotPasswordOTP);
router.put("/changePasswordUser", changePasswordUser);
router.post("/oAuthLoginUser", oAuthLoginUser);
router.post("/logoutUser", logoutUser);
router.post("/newEnglishAuctionUser", newEnglishAuctionUser);
router.post("/newReverseAuctionUser", newReverseAuctionUser);
router.get("/listAuctionUser", listAuctionUser);
router.get("/loadAuctioneerProfile", loadAuctioneerProfile);
router.post("/profileUpdate", profileUpdate);
router.post("/razorpay", razorpay);
router.post("/razorpayvalidate", razorpayvalidate);
router.post("/filterAuctions", filterAuctions);
router.post("/review", review);
router.get("/listAuctioneers", listAuctioneersUser);

export default router;
