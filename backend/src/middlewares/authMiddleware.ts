import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthRequest extends Request {
  admin?: { id: string; username: string; role: string };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "توکن یافت نشد" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      username: string;
      role: string;
    };

    req.admin = decoded; // 👈 اینجا اضافه می‌کنیم

    next();

  } catch (error) {
    return res.status(401).json({ message: "توکن نامعتبر است" });
  }
};
// فقط ادمین
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.admin) return res.status(403).json({ message: "دسترسی غیرمجاز" });
  next();
};

// فقط سوپر ادمین
export const isSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.admin?.role !== "superadmin") {
    return res.status(403).json({ message: "فقط سوپر ادمین مجاز است" });
  }
  next();
};
