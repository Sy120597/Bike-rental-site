import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // ✅ added
import connectDB from "./config/db.js";

// 🔹 Import Routes
import userRoutes from "./routes/userRoutes.js"; // ✅ added
import bookingRoutes from "./routes/bookingRoutes.js"; // ✅ user bookings
import adminRoutes from "./routes/adminRoutes.js";
import adminNotificationRoutes from "./routes/adminNotificationRoutes.js";
import adminBookingRoutes from "./routes/adminBookingRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import adminReportRoutes from "./routes/adminReportRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// 🔹 Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// 🔹 Make Socket.IO globally accessible
app.set("io", io);

// 🔹 Handle Admin Socket Connections
io.on("connection", (socket) => {
  console.log("🟢 Admin connected via socket:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Admin disconnected:", socket.id);
  });
});

// 🔹 Middleware
app.use(express.json());
app.use(cookieParser()); // ✅ Required for login cookies
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true, // ✅ allow cookies from frontend
  })
);

// 🔹 API Routes
app.use("/api/users", userRoutes); // ✅ activate user login/register/me routes
app.use("/api/bookings", bookingRoutes); // ✅ user bookings (create, get, cancel)
app.use("/api/admin", adminRoutes);
app.use("/api/admin/notifications", adminNotificationRoutes);
app.use("/api/admin/bookings", adminBookingRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/reports", adminReportRoutes);
app.use("/api/admin/auth", adminAuthRoutes);


// 🔹 Test Route
app.get("/", (req, res) => {
  res.send("🚀 Scoovi backend is running...");
});

// 🔹 Start Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
