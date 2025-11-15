import { Request, Response } from "express";
import { Admin } from "../models/adminModel";
import fs from "fs";
import path from "path";

export const uploadProfileImage = async (req: any, res: Response) => {
  try {
    const adminId = req.admin.id;

    if (!req.file) {
      return res.status(400).json({ message: "فایلی آپلود نشده است" });
    }

    const imagePath = "/uploads/" + req.file.filename;

    // ادمین فعلی پیدا شود
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "ادمین پیدا نشد" });

    // حذف عکس قبلی در صورت وجود
    if (admin.profileImage) {
      const oldPath = path.join(__dirname, "../../" + admin.profileImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    admin.profileImage = imagePath;
    await admin.save();

    res.json({
      message: "عکس پروفایل با موفقیت بروز شد",
      profileImage: imagePath
    });

  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
