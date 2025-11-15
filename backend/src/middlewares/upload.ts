import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const uploadPath = path.join(__dirname, "../../uploads");

// اگر پوشه وجود نداشت، بساز
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, uploadPath);
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const ext = path.extname(file.originalname);
    const fileName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, fileName);
  }
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowed = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("فرمت فایل معتبر نیست"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});
