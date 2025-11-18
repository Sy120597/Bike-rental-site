// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//   } catch (err) {
//     console.error("❌ MongoDB connection failed:", err.message);
//     process.exit(1);
//   }
// };

// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true); // helps avoid Mongoose warnings

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5001, // fail fast if not reachable
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);

    // more readable error handling
    if (err.name === "MongooseServerSelectionError") {
      console.error("🧭 Check if your MongoDB URI or network is correct.");
    }

    process.exit(1); // exit app if DB not connected
  }
};

// Optional: handle disconnection or reconnection events
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected!");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB reconnected successfully!");
});

export default connectDB;
