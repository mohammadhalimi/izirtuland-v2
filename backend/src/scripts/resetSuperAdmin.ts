import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Admin } from "../models/adminModel";

dotenv.config();

const resetSuperAdminPassword = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  const hash = await bcrypt.hash("superadmin123", 10);
  await Admin.findOneAndUpdate(
    { username: "superadmin" },
    { password: hash }
  );
  console.log("✅ Super admin password reset successfully");
  process.exit(0);
};

resetSuperAdminPassword();
