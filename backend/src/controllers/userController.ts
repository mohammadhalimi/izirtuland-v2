import { Request, Response } from "express";
import { User } from "../models/User";
import { AuthRequest } from "../middlewares/authUser";
import { Order } from "../models/Order";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "توکن نامعتبر" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "کاربر یافت نشد" });

    const orders = await Order.find({ user: req.user.id });

    return res.json({ success: true, user, orders });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "توکن نامعتبر" });
    }

    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name packageSize')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error("Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "خطا در دریافت سفارشات",
      details: error.message,
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "توکن نامعتبر" });

    const { name, address } = req.body;

    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: "کاربر یافت نشد" });

    // ویرایش اطلاعات
    if (name) user.name = name;
    if (address) user.address = address;

    await user.save();

    return res.json({
      success: true,
      message: "پروفایل با موفقیت بروزرسانی شد",
      user
    });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // اگر HTTPS داری بذار true
  });

  return res.json({ success: true, message: "Logged out" });
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}