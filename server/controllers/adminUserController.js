import User from "../models/User.js";

// 🟢 Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// 🟢 Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

// 🟢 Block / Unblock a user
export const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user status" });
  }
};

// 🔹 Update user details (admin only)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, role, isBlocked } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Only update allowed fields
    if (typeof fullName === "string") user.fullName = fullName;
    if (typeof email === "string") user.email = email;
    if (typeof role === "string" && ["user", "admin"].includes(role)) user.role = role;
    if (typeof isBlocked === "boolean") user.isBlocked = isBlocked;

    await user.save();
    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(200).json({ message: "User updated", user: safeUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};
