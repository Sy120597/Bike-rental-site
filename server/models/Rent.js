import mongoose from "mongoose";

const rentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bikeId: { type: mongoose.Schema.Types.ObjectId, ref: "Bike" },
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  totalAmount: Number,
}, { timestamps: true });

export default mongoose.model("Rent", rentSchema);
