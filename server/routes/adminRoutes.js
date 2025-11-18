import express from "express";
import {
  loginAdmin,
  registerAdmin,
  getAdminProfile,
  logoutAdmin,
  verifyAdminToken,
} from "../controllers/adminController.js";

import {
  protectAdmin,
  superAdminOnly,
} from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/admin/login
 * @desc    Login existing admin
 * @access  Public
 */
router.post("/login", loginAdmin);

/**
 * @route   POST /api/admin/register
 * @desc    Register a new admin (super admin only)
 * @access  Protected
 */
router.post("/register", superAdminOnly, registerAdmin);

/**
 * @route   GET /api/admin/verify
 * @desc    Verify admin token
 * @access  Private
 */
router.get("/verify", protectAdmin, verifyAdminToken);

/**
 * @route   GET /api/admin/me
 * @desc    Get logged-in admin profile
 * @access  Private
 */
router.get("/me", protectAdmin, getAdminProfile);

/**
 * @route   POST /api/admin/logout
 * @desc    Logout admin
 * @access  Private
 */
router.post("/logout", protectAdmin, logoutAdmin);

export default router;
