import express from "express";
import { protectAdmin } from "../middleware/adminAuthMiddleware.js";
import {
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/adminBookingController.js";

const router = express.Router();

router.get("/", protectAdmin, getAllBookings);
router.put("/:id", protectAdmin, updateBookingStatus);  // 🔹 Changed from /:id/status to /:id
router.delete("/:id", protectAdmin, deleteBooking);

export default router;
