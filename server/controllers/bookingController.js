import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";

// 🟢 Create new booking
export const createBooking = async (req, res) => {
  try {
    const { userId, bikeModel, date, time, location } = req.body;

    // 1️⃣ Create new booking entry
    const newBooking = new Booking({
      userId,
      bikeModel,
      date,
      time,
      location,
      status: "Pending", // default
    });

    await newBooking.save();

    // 2️⃣ Create notification for admin
    await Notification.create({
      type: "booking",
      message: `New booking from ${req.user?.email || "Unknown User"} for ${newBooking.bikeModel}`,
    });

    // 3️⃣ Emit real-time event via Socket.IO
    if (req.app.get("io")) {
      req.app.get("io").emit("newNotification", {
        type: "booking",
        message: `New booking from ${req.user?.email || "Unknown User"} for ${newBooking.bikeModel}`,
      });
    }

    // 4️⃣ Send success response
    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("❌ Booking creation failed:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🟢 Get all bookings (user-specific or admin)
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

// 🟢 Cancel booking (user side)
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "Cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled", booking });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling booking", error: error.message });
  }
};
