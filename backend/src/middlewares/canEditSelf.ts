import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

export const canEditSelf = (req: AuthRequest, res: Response, next: NextFunction) => {
  const targetId = req.params.id;

  if (!req.admin) {
    return res.status(401).json({ message: "توکن معتبر نیست" });
  }

  if (req.admin.id === targetId || req.admin.role === "superadmin") {
    return next();
  }

  return res.status(403).json({
    message: "شما اجازه ویرایش این ادمین را ندارید"
  });
};
