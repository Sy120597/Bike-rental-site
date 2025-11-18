import express from "express";
import { protectAdmin } from "../middleware/adminAuthMiddleware.js";
import { getDashboardStats } from "../controllers/adminReportController.js";

const router = express.Router();

// ✅ Admin Dashboard Stats
router.get("/stats", protectAdmin, getDashboardStats);

export default router;
