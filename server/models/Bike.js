import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema({
  name: String,
  type: String,
  pricePerHour: Number,
  image: String,
  available: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Bike", bikeSchema);
