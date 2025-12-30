// src/components/user/OrderItemCard.tsx
import { component$ } from '@builder.io/qwik';
import type { OrderItem } from '../types/user';

interface OrderItemCardProps {
  item: OrderItem;
  index: number;
}

const formatPackageSize = (packageSize: string) => {
  const sizeMap: { [key: string]: string } = {
    '1kg': '1 کیلوگرم',
    '10kg': '10 کیلوگرم',
    '1litre': '1 لیتر',
    '5liter': '5 لیتر',
    '20litre': '20 لیتر'
  };
  return sizeMap[packageSize] || packageSize;
};

export default component$<OrderItemCardProps>(({ item }) => {
  const totalPrice = item.quantity * item.price;

  return (
    <div class="group relative bg-white rounded-xl border border-gray-200 hover:border-green-300 transition-all duration-300 overflow-hidden hover:shadow-md">
      {/* Background Gradient Effect */}
      <div class="absolute inset-0 bg-linear-to-r from-green-50/0 via-emerald-50/0 to-green-50/0 group-hover:from-green-50/30 group-hover:via-emerald-50/20 group-hover:to-green-50/30 transition-all duration-500"></div>

      <div class="relative p-4">
        <div class="flex items-start justify-between gap-4">
          {/* Left Section - Product Info */}
          <div class="flex-1 min-w-0">
            <div class="flex items-start gap-3">

              {/* Product Details */}
              <div class="flex-1 min-w-0">
                {/* Product Name */}
                <h4 class="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2 group-hover:text-green-700 transition-colors">
                  {item.product.name}
                </h4>

                {/* Tags Row */}
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  {/* Brand Badge */}
                  {item.brand && (
                    <span class="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                      {item.brand}
                    </span>
                  )}

                  {/* Package Size */}
                  <span class="inline-flex items-center px-2 py-0.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                    <span class="ml-1">📦</span>
                    {formatPackageSize(item.product.packageSize)}
                  </span>
                </div>
                <div class="text-xs text-gray-500 font-mono truncate">
                  شناسه: {item.product._id?.slice(-8) || '---'}
                </div>
              </div>
            </div>
          </div>
          <div class="shrink-0">
            <div class="text-right">
              <div class="mb-1">
                <div class="text-sm text-gray-600 flex items-center justify-end gap-1">
                  <span class="text-gray-500">تعداد:</span>
                  <span class="font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                    {item.quantity} عدد
                  </span>
                </div>
                <div class="text-xs text-gray-500 mt-0.5">
                  قیمت واحد: {item.price.toLocaleString()} تومان
                </div>
              </div>
              <div class="mt-2 pt-2 border-t border-gray-100">
                <div class="text-sm text-gray-600">قیمت کل:</div>
                <div class="font-bold text-lg text-green-600 mt-0.5">
                  {totalPrice.toLocaleString()}
                  <span class="text-sm font-normal mr-1">تومان</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="flex items-center justify-between text-xs text-gray-500">
            <div class="flex items-center gap-2">
              <span>💰</span>
              <span>محاسبه قیمت:</span>
            </div>
            <div class="font-medium text-gray-700">
              {item.quantity} × {item.price.toLocaleString()} = {totalPrice.toLocaleString()} تومان
            </div>
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-green-300 via-emerald-400 to-green-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </div>
  );
});