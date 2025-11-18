import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/upload";
import { createPost, getAllPosts, getPostById , deletePost } from "../controllers/postController";

const router = express.Router();

// ایجاد پست (فقط ادمین)
router.post(
  "/create",
  verifyToken,
  isAdmin,
  upload.single("image"),
  createPost
);

// دریافت همه پست‌ها
router.get("/", getAllPosts);

// دریافت یک پست با جزئیات نویسنده
router.get("/:id", getPostById);

router.delete("/:id",verifyToken,isAdmin, deletePost);
export default router;
