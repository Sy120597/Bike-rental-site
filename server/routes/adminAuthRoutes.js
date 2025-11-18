import express from "express";
import {
  adminLogin,
  getAdminProfile,
  adminLogout,
} from "../controllers/adminAuthController.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/me", getAdminProfile);
router.post("/logout", adminLogout);

export default router;
