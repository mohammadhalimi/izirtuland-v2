import { Schema, model, Types, Document } from "mongoose";

export interface IOrder extends Document {
  user: Types.ObjectId;  
  items: {
    product: Types.ObjectId;   // رفرنس به محصول
    quantity: number;          // تعداد
    price: number;             // قیمت در زمان سفارش
    packageSize: string;       // ابعاد انتخاب‌شده محصول
  }[];
  totalPrice: number;
  address?: string;
  phone: string;
  name?: string;
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      packageSize: { type: String, required: true },
    },
  ],

  totalPrice: { type: Number, required: true },

  // اطلاعات دریافت‌شده از کاربر
  address: { type: String },
  phone: { type: String, required: true },
  name: { type: String },

  createdAt: { type: Date, default: Date.now },
});

export const Order = model<IOrder>("Order", orderSchema);
