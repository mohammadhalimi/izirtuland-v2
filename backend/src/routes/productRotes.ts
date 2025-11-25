import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/upload";
import { createProduct , getProduct , deleteProduct , updateProduct } from "../controllers/producController";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  isAdmin,
  upload.single("image"),
  createProduct
);

router.get("/" , getProduct)

router.delete("/delete" , verifyToken , isAdmin , deleteProduct)

router.put("/update" , verifyToken , isAdmin , updateProduct)
export default router;