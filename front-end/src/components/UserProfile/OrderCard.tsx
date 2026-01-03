// src/components/user/OrderCard.tsx
import { component$ } from '@builder.io/qwik';
import type { Order } from '../types/user';
import OrderItemCard from './OrderItemCard';
import { formatDate, formatTime, getStatusClass, getStatusText } from '../function/function';

interface OrderCardProps {
  order: Order;
  isCompleted?: boolean;
  showStatus?: boolean;
  searchTerm?: string; // اضافه شده برای جستجو
  showSearchHighlight?: boolean; // اضافه شده برای هایلایت
}

export default component$<OrderCardProps>(({ 
  order, 
  showStatus = false,
  searchTerm = '',
  showSearchHighlight = false
}) => {

  // تابع برای هایلایت متن مطابق با جستجو
  const highlightSearchText = (text: string) => {
    if (!searchTerm || !showSearchHighlight || !text) return text;
    
    const searchLower = searchTerm.toLowerCase();
    const textLower = text.toString().toLowerCase();
    
    if (textLower.includes(searchLower)) {
      const parts = text.toString().split(new RegExp(`(${searchTerm})`, 'gi'));
      
      return (
        <span>
          {parts.map((part, index) => 
            part.toLowerCase() === searchLower ? 
              <mark key={index} class="bg-yellow-200 px-1 rounded mx-0.5">{part}</mark> : 
              part
          )}
        </span>
      );
    }
    
    return text;
  };

  // بررسی اینکه آیا این سفارش با عبارت جستجو مطابقت دارد
  const isMatchingSearch = searchTerm && showSearchHighlight ? 
    (order.payment?.trackId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
     order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.items.some(item => 
       item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.brand?.toLowerCase().includes(searchTerm.toLowerCase())
     )) : true;

  // اگر در حال جستجو هستیم و سفارش مطابقت ندارد، کارت را نشان نده
  if (searchTerm && showSearchHighlight && !isMatchingSearch) {
    return null;
  }

  return (
    <div class={`bg-white border ${searchTerm && isMatchingSearch ? 'border-yellow-300' : 'border-green-100'} rounded-2xl p-6 hover:shadow-lg transition-all duration-200 ${searchTerm && isMatchingSearch ? 'ring-2 ring-yellow-100' : ''}`}>
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
                کد رهگیری #
                {highlightSearchText(order.payment.trackId?.toString() || order._id.slice(-6))}
              </h3>
              
              {/* Status Badge */}
              {showStatus && (
                <span class={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              )}
              
              {/* نشانه مطابقت با جستجو */}
              {searchTerm && isMatchingSearch && showSearchHighlight && (
                <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1">
                  <span>🔍</span>
                  <span>مطابقت دارد</span>
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
                <div class="font-medium text-gray-900">
                  {highlightSearchText(order.name)}
                </div>
              </div>
            )}
            
            {order.phone && (
              <div>
                <div class="text-xs text-gray-500 mb-1">شماره تماس</div>
                <div class="font-medium text-gray-900 flex items-center gap-2">
                  <span>📞</span>
                  <span>{highlightSearchText(order.phone)}</span>
                </div>
              </div>
            )}
            
            {order.address && (
              <div class="md:col-span-2">
                <div class="text-xs text-gray-500 mb-1">آدرس</div>
                <div class="font-medium text-gray-900 flex items-start gap-2">
                  <span class="mt-1">📍</span>
                  <span>{highlightSearchText(order.address)}</span>
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
            <OrderItemCard 
              key={index} 
              item={item} 
              index={index}
              searchTerm={searchTerm}
              showSearchHighlight={showSearchHighlight}
            />
          ))}
        </div>
      </div>
      
      {/* اطلاعات جستجو (اگر فعال باشد) */}
      {searchTerm && isMatchingSearch && showSearchHighlight && (
        <div class="mt-4 pt-4 border-t border-yellow-200">
          <div class="flex items-center gap-2 text-sm text-yellow-700">
            <span>🔍</span>
            <span>این سفارش با عبارت "<span class="font-bold">{searchTerm}</span>" مطابقت دارد</span>
          </div>
        </div>
      )}
    </div>
  );
});