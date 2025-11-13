import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Admin } from "../models/adminModel";

export const registerAdmin = async (username: string, password: string) => {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) throw new Error("Admin already exists");

    const admin = new Admin({ username, password });
    await admin.save();
    return admin;
};

export const loginAdmin = async (username: string, password: string) => {
  const admin = await Admin.findOne({ username });
  if (!admin) throw new Error("Invalid credentials");

  // 🔹 بررسی رمز عبور
  const isMatch = await bcrypt.compare(password, admin.password);
    console.log("🔑 Password match:", isMatch);
  if (!isMatch) throw new Error("Invalid credentials");

  // 🔹 ایجاد توکن
  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  return {
    token,
    admin: {
      _id: admin._id,
      username: admin.username,
      role: admin.role,
    },
  };
};

export const getAllAdmins = async () => {
  try {
    const admins = await Admin.find().select("-password"); // رمز عبور حذف شود
    return admins;
  } catch (error) {
    throw new Error("خطا در دریافت لیست ادمین‌ها");
  }
};

export const deleteAdminById = async (id: string) => {
  const deleted = await Admin.findByIdAndDelete(id);
  return deleted;
};

export const updateAdminInfo = async (
  adminId: string,
  data: { username?: string; password?: string }
) => {
  const admin = await Admin.findById(adminId);
  if (!admin) throw new Error("ادمین مورد نظر یافت نشد");

  if (data.username) admin.username = data.username;

  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(data.password, salt);
  }

  await admin.save();

  return {
    id: admin._id,
    username: admin.username,
    role: admin.role,
    updatedAt: new Date()
  };
};