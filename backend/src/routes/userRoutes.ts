import express from "express";
import { getProfile, getMyOrders, updateProfile, logout } from "../controllers/userController";
import { verifyToken } from "../middlewares/authUser";

const router = express.Router();

router.get("/me", verifyToken, getProfile);
router.get("/me/orders", verifyToken, getMyOrders);
router.put("/me/update", verifyToken, updateProfile);

router.post("/logout", logout);
export default router;
