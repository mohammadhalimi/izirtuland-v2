import { getAllOrders, updateOrderStatus } from "../controllers/adminOrderController";
import { isAdmin, verifyToken } from "../middlewares/authMiddleware";
import express from "express";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getAllOrders);

router.patch(
  "/orders/:id/status",
  verifyToken,
  isAdmin,
  updateOrderStatus
);

export default router;