import express from "express";
import * as adminAuthController from "../controllers/authController";
import { verifyToken, isAdmin, isSuperAdmin } from "../middlewares/authMiddleware";
import { canEditSelf } from "../middlewares/canEditSelf";
import { uploadProfileImage } from "../controllers/profileController";
import { upload } from "../middlewares/upload";
import { getAllUsers } from "../controllers/userController";

const router = express.Router();

// فقط سوپر ادمین می‌تواند ادمین جدید بسازد
router.post("/register", verifyToken, isSuperAdmin, adminAuthController.register);

// همه می‌توانند لاگین کنند
router.post("/login", adminAuthController.login);

// فقط ادمین‌ها می‌توانند لیست را ببینند
router.get("/getAllAdmin", verifyToken, isAdmin, adminAuthController.getAdmins);

//اطلاعات کاربرانی که در سایت ثبت نام کرده اند .
router.get("/getAllUser", verifyToken, isAdmin, getAllUsers)

// فقط سوپر ادمین می‌تواند حذف کند و نمی‌تواند خودش را حذف کند
router.delete("/deleteAdmin/:id", verifyToken, isSuperAdmin, adminAuthController.deleteAdmin);

router.put(
  "/update/:id",
  verifyToken,   // چک می‌کند که لاگین کرده
  isAdmin,       // فقط ادمین‌ها
  canEditSelf,
  adminAuthController.updateAdmin
);

router.put(
  "/:id/upload-profile",
  verifyToken,
  isAdmin, // هر ادمین می‌تواند
  upload.single("profile"),
  uploadProfileImage
);

export default router;
