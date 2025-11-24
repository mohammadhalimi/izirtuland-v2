import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db";

import authRoutes from "./routes/authRotes";
import postRoutes from "./routes/postRoutes";
import productRotes from "./routes/productRotes"

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// برای سرو عکس‌های آپلود شده
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// routes
app.use("/api/auth", authRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/product", productRotes);

// connect DB
connectDB();

export default app;
