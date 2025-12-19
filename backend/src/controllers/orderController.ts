import { Response } from "express";
import { Order } from "../models/Order";
import { AuthRequest } from "../middlewares/authUser"; // ← ایمپورت AuthRequest

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user; // ✅ حالا TypeScript می‌دونه user وجود داره

    if (!user) {
      return res.status(401).json({ message: "کاربر ناشناس" });
    }

    const { items, totalPrice } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "سبد خرید خالی است" });
    }

    const order = await Order.create({
      user: user.id, // از user.id استفاده می‌کنیم
      items,
      totalPrice,
      phone: user.phone,
      name: "",      // در صورت نیاز از req.body بگیر
      address: "",   // در صورت نیاز از req.body بگیر
      status: "pending",
    });

    res.status(201).json({
      orderId: order._id.toString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در ایجاد سفارش" });
  }
};
