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
    if (!admin) throw new Error("Admin not found");

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw new Error("Invalid credentials");
    const token = jwt.sign(
        { id: admin._id, username: admin.username },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
    );

    return { token, admin };
};
