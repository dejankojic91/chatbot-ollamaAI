import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import OpenAI from 'openai'

import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";

dotenv.config();

const app = express();

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};
connectDB();

const openai = new OpenAI({
  apiKey: process.env.API_KEY || "",
});

// ✅ Routes
app.use("/api/auth", authRoutes
);
app.use("/api/chat", chatRoutes);

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

