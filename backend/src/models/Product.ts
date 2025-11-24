import { Schema, model, Types } from "mongoose";

export interface IProduct {
  name: string;
  content: string;
  image?: string;
  createdAt: Date;
  brand : 'Izirtu Land' | 'Khak Shimi';
  price: Number;
  model: 'جامد' | 'مایع';
  packageSize: '1kg' | '10kg' | '1litre' | '5liter' | '20litre'
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  brand: { type: String, enum: ["Izirtu Land", "Khak Shimi"], default: "Izirtu Land" },
  price: {type : Number , required: true},
  model : { type: String, enum: ["جامد" , "مایع"], default: "جامد" },
  packageSize: {type: String, enum: ["1kg" , "10kg" , "1litre" , "5liter" , "20litre"], default: "1kg" },
  createdAt: { type: Date, default: Date.now }
});

export const Product = model<IProduct>("Product", productSchema);