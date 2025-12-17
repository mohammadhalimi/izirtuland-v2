// src/components/user/OrderCard.tsx
import { component$ } from '@builder.io/qwik';
import type { Order } from '../types/user';
import OrderItemCard from './OrderItemCard';

interface OrderCardProps {
  order: Order;
  isCompleted?: boolean;
}

export default component$<OrderCardProps>(({ order, isCompleted = false }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  return (
    <div class="border border-green-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 bg-white">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3 rtl:space-x-reverse">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center border border-green-200">
            <span class="text-lg">✅</span>
          </div>
          <div>
            <h4 class="font-bold text-gray-900">سفارش #{order.orderNumber || order._id.slice(-6)}</h4>
            <p class="text-sm text-gray-500">
              {formatDate(order.createdAt)} - {new Date(order.createdAt).toLocaleTimeString('fa-IR')}
            </p>
          </div>
        </div>
        <div class="text-left">
          {isCompleted ? (
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              تکمیل شده
            </span>
          ) : (
            <span class={`text-xs font-medium px-2 py-1 rounded-full ${getStatusClass(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          )}
        </div>
      </div>

      <div class="space-y-3 mb-4">
        {order.items.map((item, index) => (
          <OrderItemCard key={index} item={item} index={index} />
        ))}
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-green-200">
        <button class="text-green-600 hover:text-green-800 font-medium text-sm flex items-center">
          <span class="ml-1">📥</span>
          دریافت فاکتور
        </button>
        <div class="text-left">
          <span class="text-sm text-gray-600">مبلغ کل: </span>
          <span class="font-bold text-lg text-green-700">
            {order.totalPrice.toLocaleString()} تومان
          </span>
        </div>
      </div>
    </div>
  );
});

// Helper functions
const getStatusClass = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed': return 'تکمیل شده';
    case 'pending': return 'در انتظار';
    case 'shipped': return 'ارسال شده';
    case 'cancelled': return 'لغو شده';
    default: return status;
  }
};