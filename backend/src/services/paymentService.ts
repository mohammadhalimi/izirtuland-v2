// src/services/paymentService.ts
import { Order } from "../models/Order";
const Zibal = require("zibal");

const zibal = new Zibal({
  merchant: process.env.ZIBAL_MERCHANT!,
});

export const verifyPayment = async (trackId: number) => {
  const result = await zibal.verify({
    trackId,
    merchant: process.env.ZIBAL_MERCHANT!,
  });

  const order = await Order.findOne({ "payment.trackId": trackId });

  if (!order) {
    throw new Error("Order not found");
  }

  if (result.result === 100 && result.status === 1) {
    order.status = "paid";
    order.payment = order.payment ?? {};
    order.payment.paidAt = new Date();
    await order.save();

    return { success: true, order };
  }

  order.status = "failed";
  await order.save();

  return { success: false, order };
};
