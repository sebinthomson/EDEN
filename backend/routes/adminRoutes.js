import express from "express";
import {
  loginAdmin,
  listUsers,
  blockUnblockUser,
  adminSearchUsers,
  adminDeleteUser,
  adminEditUser,
  adminGetUser,
  adminDashboard,
} from "../controller/adminController.js";
import {
  listEnglishAuctionsAdmin,
  listReverseAuctionsAdmin,
  approveAuctionsQuery,
  approveAuction,
  allAuctionsSalesReport,downloadSalesReport
} from "../controller/auctionController.js";
import { listAuctioneers } from "../controller/auctioneerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/loginAdmin", loginAdmin);

router.get("/adminDashboard", adminDashboard);

router.get("/allAuctionsSalesReport", allAuctionsSalesReport);
router.post("/downloadSalesReport", downloadSalesReport);

router.get("/listUsers", listUsers);
router.post("/blockUnblockUser", blockUnblockUser);

router.get("/listAuctioneers", listAuctioneers);

router.get("/listEnglishAuctionsAdmin", listEnglishAuctionsAdmin);
router.get("/listReverseAuctionsAdmin", listReverseAuctionsAdmin);

router.post("/search-users", adminSearchUsers);
router.post("/get-user", adminGetUser);
router.post("/delete-user", adminDeleteUser);
router.post("/edit-user", adminEditUser);

router.get("/approveAuctions", approveAuctionsQuery);
router.post("/approveAuction", approveAuction);

export default router;
