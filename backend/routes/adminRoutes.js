import express from "express";
import {
  authAdmin,
  listUsers,
  adminSearchUsers,
  adminDeleteUser,
  adminEditUser,
  adminGetUser,
} from "../controller/adminController.js";
const router = express.Router();

router.get("/listUsers", listUsers);

router.post("/auth", authAdmin);
router.post("/search-users", adminSearchUsers);
router.post("/get-user", adminGetUser);
router.post("/delete-user", adminDeleteUser);
router.post("/edit-user", adminEditUser);

export default router;
