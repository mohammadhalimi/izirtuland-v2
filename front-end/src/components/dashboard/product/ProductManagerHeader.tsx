// src/components/admin/dashboard/product-manager/ProductManagerHeader.tsx
import { component$ } from '@builder.io/qwik';
import { ProductManagerHeaderProps } from '~/components/types/product';



export const ProductManagerHeader = component$<ProductManagerHeaderProps>(({ onCreateClick }) => {
  return (
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">مدیریت محصولات</h2>
      <button
        onClick$={onCreateClick}
        class="bg-green-600 cursor-pointer text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 rtl:space-x-reverse"
      >
        <span>➕</span>
        <span>محصول جدید</span>
      </button>
    </div>
  );
});