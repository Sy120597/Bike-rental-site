import jwt from "jsonwebtoken";

// 🔹 Protect any route (users/admins) - verify JWT token
export const auth = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const verifyAdmin = (req, res, next) => {
  try {
    // Get token from cookie (preferred)
    const tokenFromCookie = req.cookies?.token;

    // Or from Authorization header (Bearer token)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token = tokenFromCookie;

    if (!token && authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // If no token found
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    req.user = decoded;

    // Check if admin
    if (!decoded.isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied: Admins only" });
    }

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
