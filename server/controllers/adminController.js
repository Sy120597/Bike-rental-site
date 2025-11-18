import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Generate JWT Token
 */
const generateToken = (res, adminId) => {
  const token = jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // Store token securely in cookie
  res.cookie("token", token, {
    httpOnly: true, // prevents access by JS
    secure: process.env.NODE_ENV === "production", // only HTTPS in production
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return token;
};

/**
 * @desc    Register new admin (only superadmin)
 * @route   POST /api/admin/register
 * @access  Protected (superadmin)
 */
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: role || "admin",
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("Error in registerAdmin:", error);
    res.status(500).json({ message: "Server error during admin registration" });
  }
};

/**
 * @desc    Login admin
 * @route   POST /api/admin/login
 * @access  Public
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Debug: safe log incoming admin login attempts
    console.log("[ADMIN ROUTE LOGIN_ATTEMPT]", {
      email,
      hasPassword: !!password,
      bodyKeys: Object.keys(req.body || {}),
    });

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token and store in cookie
    const token = generateToken(res, admin._id);

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

/**
 * @desc    Verify admin token
 * @route   GET /api/admin/verify
 * @access  Private
 */
export const verifyAdminToken = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json({ verified: true, admin });
  } catch (error) {
    console.error("Error in verifyAdminToken:", error);
    res.status(500).json({ message: "Server error verifying token" });
  }
};

/**
 * @desc    Get current admin profile
 * @route   GET /api/admin/me
 * @access  Private
 */
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json(admin);
  } catch (error) {
    console.error("Error in getAdminProfile:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

/**
 * @desc    Logout admin
 * @route   POST /api/admin/logout
 * @access  Private
 */
export const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};
