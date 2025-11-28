import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  phone: string;
  name?: string;
  address?: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  phone: { type: String, required: true, unique: true },
  name: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const User = model<IUser>("User", userSchema);
