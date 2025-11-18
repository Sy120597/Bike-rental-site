import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🔹 Admin Login Controller
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Debug: safe log to see what frontend is sending (do not log password value)
    console.log("[ADMIN LOGIN ATTEMPT]", {
      email,
      hasPassword: !!password,
      bodyKeys: Object.keys(req.body || {}),
    });
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Return token in response so frontend can persist it (and still set cookie)
    const safeAdmin = { id: admin._id, email: admin.email, name: admin.fullName };
    res.json({ message: "Admin logged in successfully", token, admin: safeAdmin });
  } catch (err) {
    console.error("Admin login error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔹 Verify current admin (for persistence)
export const getAdminProfile = async (req, res) => {
  try {
    const token =
      req.cookies?.adminToken ||
      req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    res.json(admin);
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 🔹 Admin Logout
export const adminLogout = (req, res) => {
  res.clearCookie("adminToken", { httpOnly: true, sameSite: "lax" });
  res.json({ message: "Admin logged out successfully" });
};
