#!/usr/bin/env node
import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";

async function createAdmin() {
  await connectDB();

  // Values can come from env, CLI args or defaults
  const email = process.env.NEW_ADMIN_EMAIL || process.argv[2] || "sy120597@gmail.com";
  const name = process.env.NEW_ADMIN_NAME || process.argv[3] || "Sy Admin";
  const password = process.env.NEW_ADMIN_PASSWORD || process.argv[4] || "Admin@1234";

  // Safety: confirm before creating when using default password
  console.log(`Creating admin with email: ${email}`);

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log("Admin already exists:", existing._id.toString());
    process.exit(0);
  }

  const admin = new Admin({ name, email, password, role: "admin" });
  await admin.save();

  console.log("✅ Admin created:", {
    id: admin._id.toString(),
    email: admin.email,
    name: admin.name,
  });

  console.log("Important: change the password after first login.");
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("Failed to create admin:", err.message || err);
  process.exit(1);
});
