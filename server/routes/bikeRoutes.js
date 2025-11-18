import express from 'express';
import { getAllBikes, addBike } from '../controllers/bikeController.js';
const router = express.Router();
router.get('/', getAllBikes);
router.post('/', addBike);
export default router;
