import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IAdmin extends Document {
  username: string;
  password: string;
  role: "superadmin" | "admin";
  profileImage: string;
  createdAt: Date;
}

const adminSchema = new Schema<IAdmin>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["superadmin", "admin"], default: "admin" },
  profileImage: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

// 🧂 هش کردن رمز قبل از ذخیره
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const Admin = model<IAdmin>("Admin", adminSchema);
