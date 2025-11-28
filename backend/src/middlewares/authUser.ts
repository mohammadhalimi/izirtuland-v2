import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; phone: string };
}

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // اول از cookie چک کن، اگر نبود از header
    const tokenFromCookie = (req.cookies && req.cookies.token) ? req.cookies.token : null;
    const authHeader = req.headers.authorization?.split(" ")[1];
    const token = tokenFromCookie || authHeader;

    if (!token) return res.status(401).json({ message: "توکن یافت نشد" });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = { id: decoded.id, phone: decoded.phone };
    next();
  } catch (err) {
    return res.status(401).json({ message: "توکن نامعتبر" });
  }
};
