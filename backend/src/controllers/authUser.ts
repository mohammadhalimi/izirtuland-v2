import { Request, Response } from "express";
import { Otp } from "../models/Otp";
import { User } from "../models/User";
import { sendVerifyCode } from "../services/kavenegar";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const sendOtp = async (req: Request, res: Response) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ message: "phone required" });

        const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits

        // ذخیره OTP در DB (یک رکورد)
        await Otp.create({ phone, code });

        // ارسال با کاوه نگار
        try {
            const result = await sendVerifyCode(phone, code, "porbar");
            return res.status(200).json({ success: true, message: "OTP sent", result });
        } catch (err) {
            console.error("Send SMS error:", err);
            // حتی اگر ارسال واقعی شکست خورد، برای توسعه می‌توانیم 200 برگردانیم یا 500
            return res.status(500).json({ success: false, message: "Failed to send SMS", details: err });
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { phone, code } = req.body;
        if (!phone || !code) return res.status(400).json({ message: "phone and code required" });

        // پیدا کردن OTP معتبر
        const otp = await Otp.findOne({ phone, code });
        if (!otp) {
            return res.status(400).json({ message: "کد وارد شده صحیح نیست یا منقضی شده" });
        }

        // حذف رکورد OTP پس از استفاده
        await Otp.deleteMany({ phone });

        // اگر کاربر وجود نداشت، بساز
        let user = await User.findOne({ phone });
        if (!user) {
            user = await User.create({ phone });
        }

        // تولید JWT
        const token = jwt.sign(
            { id: user.id, phone: user.phone },
            JWT_SECRET,
            { expiresIn: "7d" }
        );


        // ست کردن cookie httpOnly
        res.cookie("token", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 3600 * 1000 });

        return res.json({ success: true, message: "Authenticated", token, user });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
