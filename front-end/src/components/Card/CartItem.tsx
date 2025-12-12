// src/components/cart/CartItem.tsx
import { component$ } from '@builder.io/qwik';
import { MinusIcon, PlusIcon, TrashIcon, LoaderIcon } from '~/components/icons';

interface CartItemProps {
  item: any;
  isUpdating: boolean;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string, name: string) => void;
  formatPackageSize: (size: string) => string;
}

export default component$<CartItemProps>(({ 
  item, 
  isUpdating, 
  onUpdateQuantity, 
  onRemove,
  formatPackageSize 
}) => {
  return (
    <div class="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
      <div class="p-6">
        <div class="flex flex-col lg:flex-row gap-8">
          <div class="flex-1 min-w-0">
            <div class="flex flex-col h-full">
              <div class="flex-1">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 hover:text-green-600 transition-colors cursor-pointer line-clamp-2">
                      {item.name}
                    </h3>
                    <div class="flex items-center gap-3 mt-2">
                      {item.brand && (
                        <span class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                          برند: {item.brand}
                        </span>
                      )}
                      {item.packageSize && (
                        <span class="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full font-medium">
                          {formatPackageSize(item.packageSize)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div class="text-right">
                    <div class="text-2xl font-bold text-gray-900">
                      {(item.price * item.quantity).toLocaleString('fa-IR')}
                      <span class="text-sm font-normal text-gray-500 mr-1">تومان</span>
                    </div>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div class="mt-1">
                        <span class="text-sm text-gray-400 line-through">
                          {(item.originalPrice * item.quantity).toLocaleString('fa-IR')} تومان
                        </span>
                        <span class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded mr-2">
                          {Math.round((1 - item.price / item.originalPrice) * 100)}% صرفه‌جویی
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div class="pt-6 mt-6 border-t border-gray-100">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div class="flex items-center">
                    <div class="flex items-center border rounded-xl shadow-sm">
                      <button
                        onClick$={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || isUpdating}
                        class={`px-5 py-5 transition-all rounded-r-lg ${item.quantity <= 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 cursor-pointer'
                          }`}
                      >
                        <MinusIcon />
                      </button>

                      <div class="px-6 py-3 bg-gray-50 min-w-20 text-center border-x">
                        <span class="font-bold text-gray-900 text-lg">
                          {isUpdating ? <LoaderIcon /> : item.quantity}
                        </span>
                      </div>

                      <button
                        onClick$={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={isUpdating}
                        class="px-5 py-5 rounded-l-lg bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all cursor-pointer"
                      >
                        <PlusIcon />
                      </button>
                    </div>

                    <div class="mr-6 text-sm text-gray-600">
                      <p>هر واحد: {item.price.toLocaleString('fa-IR')} تومان</p>
                    </div>
                  </div>

                  <button
                    onClick$={() => onRemove(item.id, item.name)}
                    disabled={isUpdating}
                    class="flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold border border-red-200 hover:border-red-300 hover:shadow-md min-w-40 justify-center cursor-pointer"
                  >
                    {isUpdating ? (
                      <>
                        <LoaderIcon />
                        در حال حذف...
                      </>
                    ) : (
                      <>
                        <TrashIcon />
                        حذف از سبد خرید
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});