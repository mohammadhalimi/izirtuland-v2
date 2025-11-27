import { sendVerifyCode } from "../services/kavenegar";
import { Request, Response } from "express";

export const sendOtp = async (req: any, res: Response) => {
    const { phone } = req.body;

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        await sendVerifyCode(phone, code);

        res.status(200).json({
            message: "کد تأیید ارسال شد",
            code // فقط برای تست - در نسخه واقعی حذف کن
        });
    } catch (err) {
        res.status(500).json({ message: "خطا در ارسال پیامک" });
    }
};
