import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRotes";
import postRoutes from "./routes/postRoutes";
import productRotes from "./routes/productRotes"
import cookieParser from "cookie-parser";

// import smsRoute from "./routes/smsRoute"

import authUserRoutes from "./routes/authUserRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();
const app = express();


app.use(express.json());
app.use(cookieParser()); // <-- این خط خیلی مهمه

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  next();
});
// برای سرو عکس‌های آپلود شده
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// routes
app.use("/api/auth", authRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/product", productRotes);

// app.use('/api/sms', smsRoute);

app.use("/api/auth", authUserRoutes);
app.use("/api/user", userRoutes);
// connect DB
connectDB();

export default app;
