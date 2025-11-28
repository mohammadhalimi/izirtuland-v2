import { Schema, model, Document } from "mongoose";

export interface IOtp extends Document {
  phone: string;
  code: string;
  createdAt: Date;
  // TTL index: expires 5 minutes after createdAt
}

const otpSchema = new Schema<IOtp>({
  phone: { type: String, required: true, index: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // 300s = 5 minutes
});

export const Otp = model<IOtp>("Otp", otpSchema);
