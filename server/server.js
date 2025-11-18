import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

// 🔹 Import Routes
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
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

// 🔹 FRONTEND ORIGINS (local + Netlify)
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://bike-rent-web.netlify.app", // your deployed frontend
];

// 🔹 Setup Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// 🔹 Make Socket.IO globally accessible
app.set("io", io);

// 🔹 Handle Socket Connections
io.on("connection", (socket) => {
  console.log("🟢 Client connected via socket:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// 🔹 Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// 🔹 API Routes
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
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
