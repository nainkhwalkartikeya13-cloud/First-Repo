import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

// Load .env relative to this file — works from any working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import razorpayRoutes from "./routes/razorpayRoutes.js";
import connectDB from "./config/db.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRouter.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

// ✅ CLOUDINARY ENV
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_SECRET_KEY = process.env.CLOUDINARY_SECRET_KEY;

if (!CLOUDINARY_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_SECRET_KEY) {
  console.error("❌ Cloudinary env vars missing");
  process.exit(1);
}

// ✅ CONFIGURE CLOUDINARY ONCE
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET_KEY,
});

// ✅ CONNECT DB
connectDB(process.env.MONGO_URI);

const app = express();
const port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://aerolith-seven.vercel.app",
      process.env.CORS_ORIGIN
    ].filter(Boolean),
    credentials: true,
  })
);
// Allow large base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cookieParser());

// ROUTES
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

app.use("/api/v1/coupon", couponRoutes);

app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/razorpay", razorpayRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);

// ERROR HANDLING (must be after routes)
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

