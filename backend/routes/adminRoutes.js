import express from "express";
import { authAdmin, adminListUsers } from "../controller/adminController.js";
const router = express.Router();

router.post("/auth", authAdmin);
router.get("/list-users", adminListUsers);

export default router;