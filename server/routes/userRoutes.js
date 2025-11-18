import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// ✅ Helper — create token + cookie
const createTokenAndSetCookie = (res, user) => {
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 12 * 60 * 60 * 1000, // 12 hours
  });
  return token; // ✅ return token so frontend can store it
};

// ============================================================
// 🔹 REGISTER USER — with admin notification + socket update
// ============================================================
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashed });

    // ✅ Create notification for admin
    await Notification.create({
      type: "user",
      message: `New user registered: ${user.fullName} (${user.email})`,
    });

    // ✅ Real-time update through socket.io
    const io = req.app.get("io");
    if (io) {
      io.emit("newNotification", {
        type: "user",
        message: `New user registered: ${user.fullName} (${user.email})`,
      });
    }

    // ✅ Create cookie + return token
    const token = createTokenAndSetCookie(res, user);

    res.status(201).json({
      message: "User registered successfully",
      token, // ✅ added
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================
// 🔹 LOGIN USER
// ============================================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Helpful debug log (don't log actual password value)
    console.log("[LOGIN ATTEMPT]", { email, hasPassword: !!password });
    if (!email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Invalid credentials" });

    const token = createTokenAndSetCookie(res, user);

    res.json({
      message: "Login successful",
      token, // ✅ added
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================
// 🔹 LOGOUT
// ============================================================
router.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "lax" });
  res.json({ message: "Logged out" });
});

// ============================================================
// 🔹 GET CURRENT USER INFO
// ============================================================
router.get("/me", async (req, res) => {
  const token = req.cookies?.token;
  let usedToken = token;

  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!usedToken && authHeader?.startsWith("Bearer ")) {
    usedToken = authHeader.split(" ")[1];
  }

  if (!usedToken)
    return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(usedToken, process.env.JWT_SECRET);
    console.log('[DEBUG] /api/users/me usedToken present, decoded id:', decoded.id);
    const user = await User.findById(decoded.id).select("-password");
    console.log('[DEBUG] /api/users/me found user:', !!user, user?._id?.toString());

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
