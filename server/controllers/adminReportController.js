import User from "../models/User.js";
import Booking from "../models/Booking.js";

// 🟢 Get overall stats for dashboard
export const getDashboardStats = async (req, res) => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Today's stats
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayUsers = await User.countDocuments({ createdAt: { $gte: startOfDay } });
    const todayBookings = await Booking.countDocuments({ createdAt: { $gte: startOfDay } });

    // Optional: Monthly trend (for charts)
    const currentYear = new Date().getFullYear();
    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      totalUsers,
      totalBookings,
      todayUsers,
      todayBookings,
      monthlyBookings,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
