import { Schema, model, Types } from "mongoose";

export interface IOrder {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: {
    product: Types.ObjectId;
    quantity: number;
    price: number;
    packageSize: string;
  }[];
  totalPrice: number;
  phone: string;
  address?: string;
  name?: string;
  payment: {
    trackId?: number;
    paidAt?: Date;
  };

  status: "iscompleted" | "paid" | "pending";


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
      brand: { type: String, required: true }
    },
  ],

  totalPrice: { type: Number, required: true },
  payment: {
    trackId: { type: Number },
    paidAt: { type: Date },
  },
  status: {
    type: String,
    enum: ["iscompleted", "paid", "pending"],
    default: "pending",
  },



  address: String,
  phone: { type: String, required: true },
  name: String,

  createdAt: { type: Date, default: Date.now },
});

export const Order = model<IOrder>("Order", orderSchema);
