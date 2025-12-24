import { getAllOrders } from "../controllers/adminOrderController";
import { isAdmin, verifyToken } from "../middlewares/authMiddleware";
import express from "express";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getAllOrders);

export default router;