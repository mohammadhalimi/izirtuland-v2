// routes/smsRoutes.ts
import express from 'express';
import { sendOrderConfirmationSMSHandler } from '../controllers/smsController';
import { verifyToken } from '../middlewares/authUser'; 

const router = express.Router();

// مسیر ارسال اس‌ام‌اس تأیید سفارش
router.post('/order-confirmation', verifyToken, sendOrderConfirmationSMSHandler);

export default router;