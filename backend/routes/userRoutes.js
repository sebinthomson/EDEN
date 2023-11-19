import express from "express";
import {
  sendVerifyMail,
  registerUser,
  loginUser,
  oAuthLoginUser,
  logoutUser,
  newAuctionUser,
  updateUserProfile,
  updateUserImage,
} from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post("/sendVerifyMail", sendVerifyMail);
router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.post("/oAuthLoginUser", oAuthLoginUser);
router.post("/logoutUser", logoutUser);
router.post("/newAuctionUser", upload.array("images", 3), newAuctionUser);

router.route("/profile").put(protect, updateUserProfile);
router.put(
  "/profile-updateImage",
  upload.single("image"),
  protect,
  updateUserImage
);

export default router;
