import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bikeModel: { type: String, required: true },
  title: { type: String, enum: ["Mr.", "Mrs."], default: "Mr." },
  customerName: { type: String, default: "" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    pickupLocation: { type: String, required: true },
    totalPrice: { type: Number, required: true },
  contactNumber: { type: String, default: "" },
    status: { type: String, enum: ["Pending", "Confirmed", "Rejected"], default: "Pending" },
    confirmedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
