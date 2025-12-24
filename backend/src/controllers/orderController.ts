// controllers/orderController.ts
import { Response } from "express";
import { AuthRequest } from "../middlewares/authUser";
import { Order } from "../models/Order";
import { User } from "../models/User";

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { items, totalPrice } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 🔹 گرفتن اطلاعات کاربر
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ اینجاست که کد تو باید باشه
    const order = await Order.create({
      user: user._id,
      items,
      totalPrice,
      phone: user.phone,
      name: user.name,
      address: user.address,
    });

    return res.status(201).json({
      orderId: order._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

