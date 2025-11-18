import Notification from "../models/Notification.js";

// 🟢 Get all notifications (latest first)
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

// 🟢 Mark all notifications as read
export const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating notifications" });
  }
};

// 🟢 Delete all notifications
export const clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany();
    res.status(200).json({ message: "All notifications cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing notifications" });
  }
};
