// src/components/user/OrderItemCard.tsx
import { component$ } from '@builder.io/qwik';
import type { OrderItem } from '../types/user';

interface OrderItemCardProps {
  item: OrderItem;
  index: number;
}

export default component$<OrderItemCardProps>(({ item, index }) => {
  return (
    <div key={index} class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center border border-green-100">
          <span class="text-gray-600">🌿</span>
        </div>
        <div>
          <p class="font-medium text-gray-900">{item.product.name}</p>
          <p class="text-xs text-gray-500">{item.product.packageSize}</p>
        </div>
      </div>
      <div class="text-left">
        <p class="font-medium text-gray-900">{item.quantity} × {item.price.toLocaleString()}</p>
        <p class="text-sm text-gray-600">{(item.quantity * item.price).toLocaleString()} تومان</p>
      </div>
    </div>
  );
});