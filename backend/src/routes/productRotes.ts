import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/upload";
import { createProduct , getProduct } from "../controllers/producController";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  isAdmin,
  upload.single("image"),
  createProduct
);

router.get("/" , getProduct)

export default router;