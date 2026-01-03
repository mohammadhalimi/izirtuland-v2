import Kavenegar from "kavenegar";

const api = Kavenegar.KavenegarApi({
    apikey: process.env.KAVENEGAR_API_KEY!
});

export type SendSMSResult = {
  success: boolean;
  data?: any;
  message?: string;
  details?: any;
};

// Enum برای نام الگوها در کاوه‌نگار
export enum KavenegarTemplates {
  OTP = "porbar", // الگوی اصلی OTP
  ORDER = "Order", // الگوی سفارش برای کاربر
  ADMIN = "admin"  // الگوی اطلاع‌رسانی به ادمین
}

export const sendVerifyCode = (
  phone: string, 
  token: string, // کد رهگیری
  template: KavenegarTemplates
): Promise<SendSMSResult> => {
    return new Promise((resolve, reject) => {
        api.VerifyLookup(
            {
                receptor: phone,
                token: token,
                template: template
            },
            (response: any) => {
                console.log(`✅ پاسخ کاوه‌نگار برای ${template}:`, {
                    status: response?.return?.status,
                    message: response?.return?.message,
                    entriesCount: Array.isArray(response) ? response.length : 0
                });

                if (response?.return?.status === 200) {
                    resolve({ 
                        success: true, 
                        data: response,
                        message: `اس‌ام‌اس با الگوی ${template} ارسال شد`
                    });
                } else if (Array.isArray(response) && response.length > 0) {
                    const first = response[0];
                    if (first.status === 1 || first.status === 5) {
                        resolve({ 
                            success: true, 
                            data: response,
                            message: `اس‌ام‌اس با الگوی ${template} ارسال شد`
                        });
                    } else {
                        reject({ 
                            success: false, 
                            details: response,
                            message: `خطا در ارسال اس‌ام‌اس (کد وضعیت: ${first.status})`
                        });
                    }
                } else {
                    reject({ 
                        success: false, 
                        details: response || null,
                        message: 'پاسخ نامعتبر از سرور کاوه‌نگار'
                    });
                }
            }
        );
    });
};

// تابع جدید مخصوص ارسال اس‌ام‌اس تأیید سفارش
export const sendOrderConfirmationSMS = async (
  userPhone: string,
  adminPhone: string,
  trackingCode: string
): Promise<{
  userSms: SendSMSResult;
  adminSms: SendSMSResult;
}> => {
  const results = {
    userSms: { success: false } as SendSMSResult,
    adminSms: { success: false } as SendSMSResult
  };

  try {
    // ۱. ارسال اس‌ام‌اس به کاربر
    if (userPhone) {
      try {
        results.userSms = await sendVerifyCode(
          userPhone,
          trackingCode,
          KavenegarTemplates.ORDER
        );
      } catch (userError: any) {
        console.error(`❌ خطا در ارسال اس‌ام‌اس به کاربر ${userPhone}:`, userError);
        results.userSms = {
          success: false,
          message: userError.message || 'خطا در ارسال اس‌ام‌اس به کاربر',
          details: userError.details
        };
      }
    }

    // ۲. ارسال اس‌ام‌اس به ادمین
    if (adminPhone) {
      try {
        results.adminSms = await sendVerifyCode(
          adminPhone,
          trackingCode,
          KavenegarTemplates.ADMIN
        );
      } catch (adminError: any) {
        console.error(`❌ خطا در ارسال اس‌ام‌اس به ادمین ${adminPhone}:`, adminError);
        results.adminSms = {
          success: false,
          message: adminError.message || 'خطا در ارسال اس‌ام‌اس به ادمین',
          details: adminError.details
        };
      }
    }

    return results;
    
  } catch (error: any) {
    console.error('خطا در فرآیند ارسال اس‌ام‌اس:', error);
    throw error;
  }
};