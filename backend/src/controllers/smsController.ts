// controllers/smsController.ts
import { Request, Response } from "express";
import { Order } from "../models/Order";
import { User } from "../models/User";
import { sendOrderConfirmationSMS } from "../services/kavenegar";
import { AuthRequest } from "../middlewares/authUser"; // ایمپورت interface

export const sendOrderConfirmationSMSHandler = async (req: AuthRequest, res: Response) => {
    try {        
        const { orderId, trackId } = req.body;
        
        // گرفتن userId از کاربر احراز هویت شده
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                success: false,
                message: "کاربر احراز هویت نشده است" 
            });
        }

        if (!orderId || !trackId) {
            return res.status(400).json({ 
                success: false,
                message: "شناسه سفارش و کد رهگیری الزامی است" 
            });
        }

        // ۱. اطلاعات سفارش و کاربر را بگیرید
        const order = await Order.findById(orderId);
        const user = await User.findById(userId);

        if (!order) {
            return res.status(404).json({ 
                success: false,
                message: "سفارش یافت نشد" 
            });
        }

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "کاربر یافت نشد" 
            });
        }

        // بررسی اینکه آیا سفارش متعلق به این کاربر است (امنیت)
        if (order.user.toString() !== userId) {
            console.warn(`⚠️ تلاش دسترسی غیرمجاز: کاربر ${userId} به سفارش ${orderId}`);
            return res.status(403).json({
                success: false,
                message: "دسترسی غیرمجاز به این سفارش"
            });
        }

        // شماره ادمین
        const adminPhone = process.env.ADMIN_PHONE || "09337061131";
        const userPhone = user.phone;

        if (!userPhone) {
            return res.status(400).json({
                success: false,
                message: "شماره تلفن کاربر یافت نشد"
            });
        }

        const smsResults = await sendOrderConfirmationSMS(
            userPhone,
            adminPhone,
            trackId
        );

        // ۳. ذخیره وضعیت ارسال در دیتابیس
        let dbSaveSuccess = false;
        try {
            await Order.findByIdAndUpdate(orderId, {
                $set: {
                    smsSent: {
                        toUser: smsResults.userSms.success,
                        toAdmin: smsResults.adminSms.success,
                        userSentAt: smsResults.userSms.success ? new Date() : null,
                        adminSentAt: smsResults.adminSms.success ? new Date() : null,
                        userError: smsResults.userSms.success ? null : smsResults.userSms.message,
                        adminError: smsResults.adminSms.success ? null : smsResults.adminSms.message
                    }
                }
            });
            dbSaveSuccess = true;
        } catch (dbError: any) {
            console.error('❌ خطا در ذخیره وضعیت اس‌ام‌اس:', dbError.message);
        }

        // ۴. آماده کردن پاسخ
        const responseData = {
            success: smsResults.userSms.success || smsResults.adminSms.success,
            message: smsResults.userSms.success ? 
                "پیامک تأیید سفارش ارسال شد" : 
                "مشکلی در ارسال پیامک وجود داشت",
            data: {
                orderId,
                trackId,
                smsResults: {
                    user: {
                        success: smsResults.userSms.success,
                        message: smsResults.userSms.message,
                        phone: userPhone,
                        sent: smsResults.userSms.success
                    },
                    admin: {
                        success: smsResults.adminSms.success,
                        message: smsResults.adminSms.message,
                        phone: adminPhone,
                        sent: smsResults.adminSms.success
                    },
                    databaseSaved: dbSaveSuccess
                }
            }
        };

        res.status(200).json(responseData);

    } catch (error: any) {
        console.error("❌ خطا در ارسال اس‌ام‌اس:", {
            message: error.message,
            stack: error.stack
        });
        
        res.status(500).json({ 
            success: false,
            message: "خطای سرور در ارسال اس‌ام‌اس", 
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};