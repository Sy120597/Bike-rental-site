import express from 'express';
import Booking from '../models/Booking.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { bikeModel, startDate, endDate, pickupLocation, totalPrice, contactNumber, title, customerName } = req.body;
    const booking = await Booking.create({
      userId: req.user.id,
      bikeModel,
      title,
      customerName,
      startDate,
      endDate,
      pickupLocation,
      totalPrice,
      contactNumber,
    });
    res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get bookings for current user
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
    booking.status = 'Cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
