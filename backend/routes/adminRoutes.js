import express from "express";
import { authAdmin, adminListUsers, adminSearchUsers } from "../controller/adminController.js";
const router = express.Router();

router.post("/auth", authAdmin);
router.get("/list-users", adminListUsers);
router.post("/search-users", adminSearchUsers);

export default router;