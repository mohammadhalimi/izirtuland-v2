import { Admin } from "../models/adminModel";
import bcrypt from "bcrypt";

export const createSuperAdmin = async () => {
  const existingSuper = await Admin.findOne({ role: "superadmin" });
  if (existingSuper) return;

  const hashedPassword = await bcrypt.hash("superadmin123", 10);
  await Admin.create({
    username: "superadmin",
    password: hashedPassword,
    role: "superadmin",
  });

  console.log("✅ Super admin created (username: superadmin, password: superadmin123)");
};