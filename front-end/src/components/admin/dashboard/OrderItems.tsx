import { component$ } from "@builder.io/qwik";
import type { OrderItem } from "~/components/types/order";

export const OrderItems = component$<{ items: OrderItem[] }>(({ items }) => {
  const formatPackageSize = (packageSize: string) => {
    if (!packageSize) return '';
    const sizeMap: { [key: string]: string } = {
      '1kg': '۱ کیلوگرم',
      '10kg': '۱۰ کیلوگرم',
      '1litre': '۱ لیتر',
      '5liter': '۵ لیتر',
      '20litre': '۲۰ لیتر',
      '20liter': '۲۰ لیتر',
      '5litre': '۵ لیتر',
    };
    return sizeMap[packageSize.toLowerCase()] || packageSize;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  // Calculate total
  const totalPrice = items.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );

  if (items.length === 0) {
    return (
      <div class="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
        <div class="text-4xl mb-3 text-gray-300">📦</div>
        <p class="text-gray-500">محصولی در این سفارش وجود ندارد</p>
      </div>
    );
  }

  return (
    <div class="space-y-4">
      {/* Header */}
      <div class="flex items-center justify-between pb-3 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span class="text-blue-600 text-sm">🛒</span>
          </div>
          <h3 class="font-semibold text-gray-800">محصولات سفارش</h3>
        </div>
        <div class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {items.length} قلم
        </div>
      </div>

      {/* Items List */}
      <div class="space-y-3 max-h-96 overflow-y-auto pr-2">
        {items.map((item, index) => {
          const itemTotal = item.price * item.quantity;
          
          return (
            <div 
              key={`${item.product._id}-${index}`}
              class="group bg-white border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:shadow-sm transition-all duration-200"
            >
              <div class="flex items-start justify-between gap-4">
                {/* Product Info */}
                <div class="flex-1 min-w-0">
                  <div class="flex items-start gap-3">
                    {/* Product Icon */}
                    
                    {/* Details */}
                    <div class="flex-1 min-w-0">
                      {/* Name and Brand */}
                      <div class="mb-2">
                        <h4 class="font-medium text-gray-900 text-sm leading-tight mb-1">
                          {item.product.name}
                        </h4>
                        <div class="flex flex-wrap items-center gap-2">
                          {item.product.brand && (
                            <span class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                              {item.product.brand}
                            </span>
                          )}
                          <span class="text-xs text-gray-500">
                            <span class="ml-1">📦</span>
                            {formatPackageSize(item.product.packageSize)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Info */}
                <div class="shrink-0 text-left min-w-[120px]">
                  <div class="space-y-1">
                    {/* Unit Price */}
                    <div class="text-xs text-gray-500">
                      قیمت واحد:{" "}
                      <span class="font-medium text-gray-700">
                        {formatPrice(item.price)} تومان
                      </span>
                    </div>
                    
                    {/* Quantity */}
                    <div class="flex items-center gap-2">
                      <div class="text-xs text-gray-500">تعداد:</div>
                      <div class="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-0.5 rounded">
                        {item.quantity} عدد
                      </div>
                    </div>

                    {/* Item Total */}
                    <div class="pt-2 border-t border-gray-100">
                      <div class="text-sm font-bold text-green-700">
                        {formatPrice(itemTotal)}
                        <span class="text-xs font-normal mr-1">تومان</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown - Show on Hover */}
              <div class="mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="flex items-center justify-between text-xs text-gray-500">
                  <span class="flex items-center gap-1">
                    <span>🧮</span>
                    <span>محاسبه:</span>
                  </span>
                  <span class="font-medium text-gray-700">
                    {item.quantity} × {formatPrice(item.price)} = {formatPrice(itemTotal)} تومان
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer - Total Summary */}
      <div class="pt-4 border-t border-gray-200 bg-gray-50 rounded-xl p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span class="text-green-600">💰</span>
            </div>
            <div>
              <div class="text-sm text-gray-600">مجموع صورتحساب</div>
              <div class="text-xs text-gray-500">
                شامل {items.length} محصول
              </div>
            </div>
          </div>
          
          <div class="text-left">
            <div class="text-2xl font-bold text-green-700">
              {formatPrice(totalPrice)}
              <span class="text-sm font-normal mr-1">تومان</span>
            </div>
          </div>
        </div>
        
        {/* Average Price */}
        <div class="mt-3 text-xs text-gray-500 text-center">
          متوسط قیمت هر محصول:{" "}
          <span class="font-medium text-gray-700">
            {formatPrice(Math.round(totalPrice / items.length))} تومان
          </span>
        </div>
      </div>
    </div>
  );
});