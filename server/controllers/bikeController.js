import Bike from '../models/Bike.js';

export const getAllBikes = async (req,res) => {
  try {
    const bikes = await Bike.find();
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

export const addBike = async (req,res) => {
  try {
    const bike = new Bike(req.body);
    await bike.save();
    res.status(201).json({ message: 'Bike added' });
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};
