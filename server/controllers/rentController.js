import Rent from '../models/Rent.js';
import Bike from '../models/Bike.js';

export const rentBike = async (req,res) => {
  try {
    const { userId, bikeId, hours } = req.body;
    const bike = await Bike.findById(bikeId);
    if (!bike || !bike.available) return res.status(400).json({ message: 'Bike not available' });
    const totalAmount = (hours || 1) * bike.pricePerHour;
    const rent = new Rent({
      userId,
      bikeId,
      totalAmount,
      endTime: new Date(Date.now() + (hours || 1) * 60 * 60 * 1000)
    });
    await rent.save();
    bike.available = false;
    await bike.save();
    res.json({ message: 'Bike rented', rent });
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};
