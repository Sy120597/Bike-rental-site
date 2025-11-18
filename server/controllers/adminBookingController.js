import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";

//  Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

//  Update booking status (approve / reject)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!["Pending", "Confirmed", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const booking = await Booking.findById(id).populate("userId");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const oldStatus = booking.status;
    booking.status = status;
    
    // Set confirmedAt when booking is confirmed
    if (status === "Confirmed" && !booking.confirmedAt) {
      booking.confirmedAt = new Date();
    }
    
    await booking.save();

    // Emit socket.io event to notify user about status change in real-time
    const io = req.app.get("io");
    if (io && booking.userId) {
      io.emit("bookingStatusChanged", {
        bookingId: booking._id,
        userId: booking.userId._id,
        status: status,
        confirmedAt: booking.confirmedAt,
        message: `Your booking has been ${status.toLowerCase()}.`
      });
    }

    // Create notification
    await Notification.create({
      type: "booking",
      message: `Booking for ${booking.bikeModel} (${oldStatus} → ${status})`,
    });

    res.status(200).json({ message: "Booking status updated", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating booking" });
  }
};

//  Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking" });
  }
};
