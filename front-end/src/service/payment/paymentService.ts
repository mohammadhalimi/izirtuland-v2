import { API_BASE_URL } from '~/config/api';

export interface PaymentRequest {
  orderId: string;
  amount: number;
  description?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  trackId?: string;
  message?: string;
  error?: string;
}

export interface VerificationResponse {
  success: boolean;
  amount?: number;
  paidAt?: string;
  refNumber?: string;
  cardNumber?: string;
  message?: string;
}

/**
 * درخواست پرداخت جدید
 */
export async function requestPayment(orderId: string): Promise<PaymentResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Payment request error:', error);
    return {
      success: false,
      error: 'خطا در ارتباط با سرور پرداخت'
    };
  }
}

/**
 * تایید پرداخت (این تابع در بک‌اند استفاده می‌شود)
 */
export async function verifyPayment(trackId: number): Promise<VerificationResponse> {
  try {
    // این درخواست باید از بک‌اند به درگاه ارسال شود
    const response = await fetch(`${API_BASE_URL}/payment/verify`, {
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
    console.error('Payment verification error:', error);
    return {
      success: false,
      message: 'خطا در تایید پرداخت'
    };
  }
}

/**
 * به‌روزرسانی وضعیت سفارش در فرانت‌اند
 */
export async function updateOrderStatus(
  orderId: string, 
  status: 'pending' | 'completed' | 'failed' | 'cancelled',
  data?: any
): Promise<void> {
  try {
    // ذخیره در localStorage برای دسترسی سریع
    const existingOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
    const orderIndex = existingOrders.findIndex((order: any) => order._id === orderId);
    
    if (orderIndex !== -1) {
      existingOrders[orderIndex] = {
        ...existingOrders[orderIndex],
        status,
        updatedAt: new Date().toISOString(),
        ...data
      };
      localStorage.setItem('user_orders', JSON.stringify(existingOrders));
    }

    // همچنین به بک‌اند هم اطلاع دهید
    await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, ...data })
    });
  } catch (error) {
    console.error('Update order status error:', error);
  }
}

/**
 * دریافت وضعیت پرداخت
 */
export async function getPaymentStatus(orderId: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/status/${orderId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get payment status error:', error);
    return null;
  }
}