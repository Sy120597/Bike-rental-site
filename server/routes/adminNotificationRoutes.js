import express from "express";
import { protectAdmin } from "../middleware/adminAuthMiddleware.js";
import {
  getNotifications,
  markAsRead,
  clearNotifications,
} from "../controllers/adminNotificationController.js";

const router = express.Router();

// 🔹 GET all notifications
router.get("/", protectAdmin, getNotifications);

// 🔹 Mark all notifications as read
router.put("/mark-read", protectAdmin, markAsRead);

// 🔹 Clear all notifications
router.delete("/clear", protectAdmin, clearNotifications);

export default router;
