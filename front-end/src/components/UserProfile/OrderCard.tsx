// src/components/user/OrderCard.tsx
import { component$ } from '@builder.io/qwik';
import type { Order } from '../types/user';
import OrderItemCard from './OrderItemCard';

interface OrderCardProps {
  order: Order;
  isCompleted?: boolean;
  showStatus?: boolean;
}

export default component$<OrderCardProps>(({ order, isCompleted = false, showStatus = false }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div class="bg-white border border-green-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
      {/* Header Section */}
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        {/* Order Info */}
        <div class="flex items-start gap-4">
          <div class="hidden md:flex w-12 h-12 bg-green-50 rounded-xl items-center justify-center border border-green-200">
            <span class="text-xl">📦</span>
          </div>
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h3 class="font-bold text-lg text-gray-900">
                سفارش #{order.orderNumber || order._id.slice(-6)}
              </h3>
              {/* Status Badge */}
              {showStatus && (
                <span class={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              )}
            </div>
            <div class="flex flex-wrap gap-4 text-sm text-gray-600">
              <div class="flex items-center gap-1">
                <span>📅</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div class="flex items-center gap-1">
                <span>🕒</span>
                <span>{formatTime(order.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Price */}
        <div class="text-left">
          <div class="text-sm text-gray-600 mb-1">مبلغ کل</div>
          <div class="font-bold text-2xl text-green-700">
            {order.totalPrice.toLocaleString()}
            <span class="text-sm font-normal mr-1">تومان</span>
          </div>
        </div>
      </div>

      {/* Customer Info Card */}
      {(order.name || order.address || order.phone) && (
        <div class="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span class="text-green-700">👤</span>
            </div>
            <h4 class="font-medium text-gray-900">اطلاعات گیرنده</h4>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {order.name && (
              <div>
                <div class="text-xs text-gray-500 mb-1">نام و نام خانوادگی</div>
                <div class="font-medium text-gray-900">{order.name}</div>
              </div>
            )}
            
            {order.phone && (
              <div>
                <div class="text-xs text-gray-500 mb-1">شماره تماس</div>
                <div class="font-medium text-gray-900 flex items-center gap-2">
                  <span>📞</span>
                  <span>{order.phone}</span>
                </div>
              </div>
            )}
            
            {order.address && (
              <div class="md:col-span-2">
                <div class="text-xs text-gray-500 mb-1">آدرس</div>
                <div class="font-medium text-gray-900 flex items-start gap-2">
                  <span class="mt-1">📍</span>
                  <span>{order.address}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Items */}
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span class="text-blue-700">🛒</span>
          </div>
          <h4 class="font-medium text-gray-900">محصولات سفارش</h4>
          <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {order.items.length} قلم
          </span>
        </div>
        
        <div class="space-y-3">
          {order.items.map((item, index) => (
            <OrderItemCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
});

// Helper functions
const getStatusClass = (status: string) => {
  switch (status) {
    case 'paid': 
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'iscompleted': 
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    case 'pending': 
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case 'failed': 
      return 'bg-red-100 text-red-800 border border-red-200';
    default: 
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'paid': return 'پرداخت شده';
    case 'iscompleted': return 'تکمیل شده';
    case 'pending': return 'در انتظار پرداخت';
    case 'failed': return 'لغو شده';
    default: return status;
  }
};