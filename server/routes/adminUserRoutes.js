import express from "express";
import { protectAdmin } from "../middleware/adminAuthMiddleware.js";
import {
  getAllUsers,
  deleteUser,
  toggleBlockUser,
  updateUser,
} from "../controllers/adminUserController.js";

const router = express.Router();

router.get("/", protectAdmin, getAllUsers);
router.delete("/:id", protectAdmin, deleteUser);
router.put("/:id/block", protectAdmin, toggleBlockUser);
router.put("/:id", protectAdmin, updateUser);

export default router;
