import { Router } from "express";
import * as authController from "../controllers/authController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register",verifyToken, authController.register);
router.post("/login", authController.login);

export default router;
