import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/upload";
import { createProduct , getProduct , deleteProduct , updateProduct, getProductById } from "../controllers/producController";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  isAdmin,
  upload.single("image"),
  createProduct
);

router.get("/" , getProduct);

router.get("/:id" , getProductById)

router.delete("/delete/:id" , verifyToken , isAdmin , deleteProduct);

router.put(
  "/update/:id",
  verifyToken,
  isAdmin,
  upload.single("image"), // این خط اضافه شود
  updateProduct
);
export default router;