import { Request, Response } from "express";
import * as authService from "../services/adminAuthService";
import { AuthRequest } from "../middlewares/authMiddleware";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const admin = await authService.registerAdmin(username, password);
    res.status(201).json({ message: "Admin created", admin });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await authService.loginAdmin(username, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await authService.getAllAdmins();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const adminIdToDelete = req.params.id;

    // سوپر ادمین نمی‌تواند خودش را حذف کند
    if (req.admin?.id === adminIdToDelete) {
      return res.status(400).json({ message: "شما نمی‌توانید حساب خود را حذف کنید" });
    }

    const deletedAdmin = await authService.deleteAdminById(adminIdToDelete);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "ادمین پیدا نشد" });
    }

    res.status(200).json({ message: "ادمین با موفقیت حذف شد" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.params.id;

    if (!req.admin) {
      return res.status(401).json({ message: "توکن معتبر نیست" });
    }

    // هر ادمین فقط خودش را تغییر دهد، مگر سوپر‌ادمین
    if (req.admin.id !== adminId && req.admin.role !== "superadmin") {
      return res.status(403).json({
        message: "شما اجازه ویرایش اطلاعات این ادمین را ندارید"
      });
    }

    const { username, password } = req.body;

    const updated = await authService.updateAdminInfo(adminId, {
      username,
      password
    });

    res.status(200).json({
      message: "اطلاعات با موفقیت بروزرسانی شد",
      admin: updated
    });

  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
