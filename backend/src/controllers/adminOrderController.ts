import { Response } from "express";
import { Order } from "../models/Order";

export const getAllOrders = async (_req: any, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("user", "name phone")
      .populate("items.product", "name packageSize")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error("Admin Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "خطا در دریافت سفارشات",
    });
  }
};
