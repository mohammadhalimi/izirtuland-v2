import express from 'express';
import Kavenegar from 'kavenegar';
import { SendSMSResult, sendVerifyCode } from '../services/kavenegar';

const router = express.Router();

const api = Kavenegar.KavenegarApi({
    apikey: process.env.KAVENEGAR_API_KEY as string
});

// مسیر ارسال کد تایید
router.post("/send-sms", async (req, res) => {
  try {
    const { phone } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // تایپ کردن result باعث میشه TS بدون ارور بفهمه
    const result: SendSMSResult = await sendVerifyCode(phone, code);

    if (result.success) {
      res.json({
        success: true,
        message: "SMS sent successfully",
        data: result.data
      });
    } else {
      res.status(500).json(result);
    }
  } catch (err) {
    console.error("❌ خطا:", err);
    res.status(500).json({ success: false, message: "Failed to send SMS", details: err });
  }
});

export default router;

