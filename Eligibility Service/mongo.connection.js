
import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL || "mongodb://mongodb:27017/erp";

export const connectMongo = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};