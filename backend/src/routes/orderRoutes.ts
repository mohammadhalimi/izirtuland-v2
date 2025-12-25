import { Router } from "express";
import { createOrder } from "../controllers/orderController";
import { verifyToken } from "../middlewares/authUser";
const router = Router();

router.post("/",verifyToken, createOrder);

export default router;