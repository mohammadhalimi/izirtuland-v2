import { Request, Response } from "express";
import * as paymentService from "../services/paymentService";
const Zibal = require("zibal")
import { Order } from "../models/Order";

const zibal = new Zibal({
  merchant: process.env.ZIBAL_MERCHANT!,
  callbackUrl: `${process.env.ZIBAL_CALLBACK_URL}/api/payment/callback`,
});


export const startPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;

    if (!orderId) return res.status(400).json({ message: "orderId is required" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.totalPrice || order.totalPrice <= 0)
      return res.status(400).json({ message: "Invalid total price" });

    const result = await zibal.request({
      amount: order.totalPrice,
      orderId: order._id.toString(),
      merchant: process.env.ZIBAL_MERCHANT!,
      callbackUrl: `${process.env.ZIBAL_CALLBACK_URL}`,
    });

    if (result.result !== 100)
      return res.status(400).json({ message: result.message || "Error creating payment" });

    order.payment = { trackId: result.trackId }; // مطمئن شو فیلد payment در مدل Order هست
    await order.save();

    return res.json({ paymentUrl: result.paymentUrl || zibal.startURL(result.trackId) });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
};

export const paymentCallback = async (req: Request, res: Response) => {
  const { success, status, } = req.query;

  const trackId = Number(req.query.trackId);

  if (!trackId) {
    return res.redirect(`${process.env.FRONT_URL}/payment/failed`);
  }

  if (success === "1" && status === "2") {
    const result = await paymentService.verifyPayment(trackId);

    return res.redirect(
      `${process.env.FRONT_URL}/payment/success?orderId=${result.order._id.toString()}&trackId=${trackId}`
    );
  };

  return res.redirect(`${process.env.FRONT_URL}/payment/failed`);
};