// src/components/user/OrderItemCard.tsx
import { component$ } from '@builder.io/qwik';
import type { OrderItem } from '../types/user';

interface OrderItemCardProps {
  item: OrderItem;
  index: number;
  searchTerm?: string;
  showSearchHighlight?: boolean;
}

export default component$<OrderItemCardProps>(({ 
  item, 
  index, 
  searchTerm = '',
  showSearchHighlight = false 
}) => {
  
  // تابع برای هایلایت متن
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

  // بررسی آیا این آیتم با جستجو مطابقت دارد
  const isItemMatching = searchTerm && showSearchHighlight ? 
    (item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.packageSize?.toLowerCase().includes(searchTerm.toLowerCase())) : 
    false;

  return (
    <div class={`p-4 rounded-xl border ${isItemMatching ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-50'} transition-all duration-200`}>
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Product Info */}
        <div class="flex-1">
          <div class="flex items-start gap-3">
            {/* Product Number */}
            <div class={`w-8 h-8 rounded-lg flex items-center justify-center ${isItemMatching ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-700'}`}>
              <span class="font-medium">{index + 1}</span>
            </div>
            
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h4 class="font-medium text-gray-900">
                  {highlightSearchText(item.product?.name || 'محصول')}
                </h4>
                {isItemMatching && (
                  <span class="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    مطابقت دارد
                  </span>
                )}
              </div>
              
              <div class="flex flex-wrap gap-3 text-sm text-gray-600">
                {item.brand && (
                  <div class="flex items-center gap-1">
                    <span>🏷️</span>
                    <span>{highlightSearchText(item.brand)}</span>
                  </div>
                )}
                
                {item.packageSize && (
                  <div class="flex items-center gap-1">
                    <span>📦</span>
                    <span>{highlightSearchText(item.packageSize)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Price and Quantity */}
        <div class="flex flex-col md:items-end gap-2">
          <div class="flex items-center gap-4">
            <div class="text-left">
              <div class="text-sm text-gray-600 mb-1">تعداد</div>
              <div class="font-bold text-lg text-gray-900">
                {item.quantity.toLocaleString()}
                <span class="text-sm font-normal mr-1">عدد</span>
              </div>
            </div>
            
            <div class="text-left">
              <div class="text-sm text-gray-600 mb-1">قیمت واحد</div>
              <div class="font-bold text-lg text-green-700">
                {item.price.toLocaleString()}
                <span class="text-sm font-normal mr-1">تومان</span>
              </div>
            </div>
            
            <div class="text-left">
              <div class="text-sm text-gray-600 mb-1">جمع</div>
              <div class="font-bold text-xl text-blue-700">
                {(item.price * item.quantity).toLocaleString()}
                <span class="text-sm font-normal mr-1">تومان</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});