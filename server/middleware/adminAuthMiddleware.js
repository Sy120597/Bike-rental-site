import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js"; // ✅ Correct path

// 🔹 Verify JWT Token for Admin Access
export const protectAdmin = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check token in cookies (accept both `token` and `adminToken` names)
    if (req.cookies) {
      token = req.cookies.adminToken || req.cookies.token || undefined;
    }

    // 2️⃣ Check Authorization header if not in cookies
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 3️⃣ If no token found
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5️⃣ Attach admin info to request
    req.admin = await Admin.findById(decoded.id).select("-password");

    if (!req.admin) {
      return res.status(401).json({ message: "Admin not found or unauthorized." });
    }

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// 🔹 Allow only Super Admin (role-based access)
export const superAdminOnly = async (req, res, next) => {
  try {
    // Run protectAdmin first to get `req.admin`
    await protectAdmin(req, res, async () => {
      if (req.admin.role !== "superadmin") {
        return res.status(403).json({ message: "Forbidden: Super admin only." });
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Authorization failed." });
  }
};
