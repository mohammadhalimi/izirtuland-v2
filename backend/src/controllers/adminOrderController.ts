import { Response,Request } from "express";
import { Order } from "../models/Order";

export const getAllOrders = async (_req: any, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("user", "name phone address")
      .populate("items.product", "name packageSize brand")
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

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["paid", "iscompleted", "failed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "وضعیت نامعتبر است",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "سفارش یافت نشد",
      });
    }

    order.status = status;
    await order.save();

    return res.json({
      success: true,
      message: "وضعیت سفارش بروزرسانی شد",
      order,
    });
  } catch (error: any) {
    console.error("Update Order Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "خطا در بروزرسانی وضعیت سفارش",
    });
  }
};
