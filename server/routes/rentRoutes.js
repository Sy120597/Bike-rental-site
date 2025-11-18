import express from 'express';
import { rentBike } from '../controllers/rentController.js';
const router = express.Router();
router.post('/', rentBike);
export default router;
