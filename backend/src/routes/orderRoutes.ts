import { Router } from "express";
import { createOrder } from "../controllers/orderController";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", verifyToken,isAdmin, createOrder);

export default router;