import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// Connect to MongoDB
connectDB();

export default app;
