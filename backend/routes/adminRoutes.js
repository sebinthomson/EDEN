import express from "express";
import {
  loginAdmin,
  listUsers,
  blockUnblockUser,
  adminSearchUsers,
  adminDeleteUser,
  adminEditUser,
  adminGetUser,
} from "../controller/adminController.js";
import {
  listEnglishAuctionsAdmin,
  listReverseAuctionsAdmin,
} from "../controller/auctionController.js";
import { listAuctioneers } from "../controller/auctioneerController.js";

const router = express.Router();

router.post("/loginAdmin", loginAdmin);

router.get("/listUsers", listUsers);
router.post("/blockUnblockUser", blockUnblockUser);

router.get("/listAuctioneers", listAuctioneers);

router.get("/listEnglishAuctionsAdmin", listEnglishAuctionsAdmin);
router.get("/listReverseAuctionsAdmin", listReverseAuctionsAdmin);

router.post("/search-users", adminSearchUsers);
router.post("/get-user", adminGetUser);
router.post("/delete-user", adminDeleteUser);
router.post("/edit-user", adminEditUser);

export default router;
