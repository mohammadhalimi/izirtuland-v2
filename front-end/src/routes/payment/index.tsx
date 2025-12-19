import { type RequestHandler, type RequestEvent } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async (requestEvent: RequestEvent) => {
  try {
    const { url, redirect } = requestEvent;
    const searchParams = url.searchParams;
    const success = searchParams.get('success');
    const status = searchParams.get('status');
    const trackId = searchParams.get('trackId');
    const orderId = searchParams.get('orderId');

    console.log('Payment callback received:', {
      success,
      status,
      trackId,
      orderId
    });

    // اعتبارسنجی پارامترها
    if (!trackId || !orderId) {
      throw redirect(302, `/payment/failed?error=${encodeURIComponent('پارامترهای لازم ارسال نشده')}`);
    }

    // بررسی وضعیت پرداخت
    if (success === '1' && status === '2') {
      // پرداخت موفق
      try {
        // تایید پرداخت در سیستم (فراخوانی بک‌اند)
        const verificationResult = await verifyPaymentInBackend(Number(trackId));
        
        if (verificationResult.success) {
          // ریدایرکت به صفحه موفقیت
          throw redirect(302, `/payment/success?orderId=${orderId}&trackId=${trackId}&amount=${verificationResult.amount}`);
        } else {
          throw redirect(302, `/payment/failed?orderId=${orderId}&error=${encodeURIComponent(verificationResult.message || 'خطا در تایید پرداخت')}`);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        throw redirect(302, `/payment/failed?orderId=${orderId}&error=${encodeURIComponent('خطا در تایید پرداخت')}`);
      }
    } else {
      // پرداخت ناموفق یا لغو شده توسط کاربر
      let errorMessage = 'پرداخت ناموفق بود';
      
      if (success === '0' && status === '3') {
        errorMessage = 'پرداخت توسط کاربر لغو شد';
      } else if (success === '0' && status === '4') {
        errorMessage = 'پرداخت ناموفق - کارت نامعتبر';
      }

      throw redirect(302, `/payment/failed?orderId=${orderId}&error=${encodeURIComponent(errorMessage)}`);
    }

  } catch (error: any) {
    console.error('Payment callback handler error:', error);
    
    // اگر خطای redirect نباشد، به صفحه خطا ریدایرکت کنید
    if (!error.message?.includes('redirect')) {
      throw redirect(302, `/payment/error?message=${encodeURIComponent(error.message || 'خطا در پردازش پرداخت')}`);
    }
    throw error; // خطای redirect را دوباره throw کنید
  }
};

// همچنین می‌توانید یک POST handler هم داشته باشید
export const onPost: RequestHandler = async (requestEvent: RequestEvent) => {
  const { request, json } = requestEvent;
  
  try {
    // اگر درگاه POST هم callback می‌دهد
    const body = await request.json();
    console.log('POST callback:', body);
    
    // برای POST request، بهتر است یک پاسخ JSON بدهیم
    // یا اگر باید ریدایرکت کنیم:
    // throw redirect(302, `/payment/success?orderId=${body.orderId}`);
    
    json(200, { success: true, message: 'Callback received' });
  } catch (error) {
    console.error('POST callback error:', error);
    json(500, { success: false, error: 'خطا در پردازش درخواست' });
  }
};

// تابع کمکی برای تایید پرداخت در بک‌اند
async function verifyPaymentInBackend(trackId: number): Promise<{
  success: boolean;
  amount?: number;
  message?: string;
}> {
  try {
    const response = await fetch(`${process.env.API_URL}/api/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trackId })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Backend verification error:', error);
    return {
      success: false,
      message: 'خطا در ارتباط با سرور'
    };
  }
}

function redirect(arg0: number, arg1: string) {
    throw new Error('Function not implemented.');
}
