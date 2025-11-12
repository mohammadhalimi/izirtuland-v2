import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

export interface IAdmin {
  username: string;
  password: string;
}

const adminSchema = new Schema<IAdmin>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// هش کردن رمز قبل از ذخیره
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const Admin = model<IAdmin>("Admin", adminSchema);
