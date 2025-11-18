import Notification from "../models/Notification.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// =====================
// 🔹 Register User
// =====================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    // STEP 1 — Create notification for admin
    await Notification.create({
      type: "user",
      message: `New user registered: ${user.name} (${user.email})`,
    });

    // STEP 2 — Send real-time update through socket.io
    if (req.app.get("io")) {
      req.app.get("io").emit("newNotification", {
        type: "user",
        message: `New user registered: ${user.name} (${user.email})`,
      });
    }

    // STEP 3 — Send normal success response
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

// =====================
// 🔹 Login User
// =====================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

// =====================
// 🔹 Get Current User Info
// =====================
export const getMe = async (req, res) => {
  try {
    // `req.user` is set by authMiddleware
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user data", error: err.message });
  }
};
