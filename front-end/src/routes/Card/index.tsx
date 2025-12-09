// src/routes/cart/index.tsx
import { component$, useContext, $, useSignal, useStore } from '@builder.io/qwik';
import { API_BASE_URL } from '~/config/api';
import { CartContext } from '~/context/cart-context';
import {
  CartIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  TruckIcon,
  PackageIcon,
  LoaderIcon,
  ShieldIcon,
  ReceiptIcon,
} from '~/components/icons';
import { ConfirmationModal } from '~/components/ui/cards/confirmation-modal';
import { Notification } from '~/components/ui/cards/notification';

// تابع برای فرمت کردن سایز بسته
const formatPackageSize = (packageSize: string) => {
  if (!packageSize) return '';
  
  const sizeMap: { [key: string]: string } = {
    '1kg': '۱ کیلوگرم',
    '10kg': '۱۰ کیلوگرم',
    '1litre': '۱ لیتر',
    '5liter': '۵ لیتر',
    '20litre': '۲۰ لیتر',
  };

  return sizeMap[packageSize.toLowerCase()] || packageSize;
};


export default component$(() => {
  const cart = useContext(CartContext);
  const isRemoving = useSignal<string | null>(null);
  const isUpdating = useSignal<string | null>(null);
  
  // State برای modal
  const modalState = useStore({
    isOpen: false,
    type: 'clear' as 'clear' | 'remove',
    itemId: '',
    itemName: '',
    isProcessing: false
  });

  // State برای notification
  const notificationState = useStore({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  });

  // تابع نمایش notification
  const showNotification = $((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    notificationState.show = true;
    notificationState.message = message;
    notificationState.type = type;
    
    // پنهان کردن خودکار بعد از 4 ثانیه
    setTimeout(() => {
      notificationState.show = false;
    }, 4000);
  });

  // تابع بستن notification
  const closeNotification = $(() => {
    notificationState.show = false;
  });

  // باز کردن modal برای حذف آیتم
  const openRemoveModal = $((id: string, name: string) => {
    modalState.isOpen = true;
    modalState.type = 'remove';
    modalState.itemId = id;
    modalState.itemName = name;
    modalState.isProcessing = false;
  });

  // باز کردن modal برای خالی کردن سبد
  const openClearModal = $(() => {
    if (cart.items.length === 0) {
      showNotification('سبد خرید شما خالی است!', 'info');
      return;
    }
    modalState.isOpen = true;
    modalState.type = 'clear';
    modalState.isProcessing = false;
  });

  // بستن modal
  const closeModal = $(() => {
    if (!modalState.isProcessing) {
      modalState.isOpen = false;
    }
  });

  // حذف آیتم
  const removeItem = $(async (id: string) => {
    modalState.isProcessing = true;
    try {
      if (cart.removeItem) {
        await cart.removeItem(id);
        showNotification('محصول با موفقیت از سبد خرید حذف شد', 'success');
      }
    } catch (error) {
      showNotification('خطا در حذف محصول', 'error');
      console.error('Error removing item:', error);
    } finally {
      modalState.isProcessing = false;
      modalState.isOpen = false;
    }
  });

  // خالی کردن سبد خرید
  const clearCart = $(async () => {
    modalState.isProcessing = true;
    try {
      if (cart.clearCart) {
        await cart.clearCart();
        showNotification('سبد خرید با موفقیت خالی شد', 'success');
      }
    } catch (error) {
      showNotification('خطا در خالی کردن سبد خرید', 'error');
      console.error('Error clearing cart:', error);
    } finally {
      modalState.isProcessing = false;
      modalState.isOpen = false;
    }
  });

  // تابع onConfirm برای modal
  const handleConfirm = $(() => {
    if (modalState.type === 'clear') {
      clearCart();
    } else {
      removeItem(modalState.itemId);
    }
  });

  const updateQuantity = $(async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    isUpdating.value = id;
    try {
      if (cart.updateQuantity) {
        await cart.updateQuantity(id, newQuantity);
        showNotification('تعداد محصول به‌روزرسانی شد', 'success');
      }
    } catch (error) {
      showNotification('خطا در به‌روزرسانی تعداد', 'error');
      console.error('Error updating quantity:', error);
    } finally {
      isUpdating.value = null;
    }
  });

  const totalPrice = cart.items.reduce((sum: number, it: any) => sum + (it.price * it.quantity), 0);
  const totalItems = cart.items.reduce((sum: number, it: any) => sum + it.quantity, 0);
  const shippingThreshold = 500000;
  const shippingCost = totalPrice >= shippingThreshold ? 0 : 25000;
  const estimatedTax = Math.floor(totalPrice * 0.09);
  const discount = 0;

  return (
    <div class="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Notification */}
      <Notification 
        show={notificationState.show}
        message={notificationState.message}
        type={notificationState.type}
        onClose={closeNotification}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        itemName={modalState.itemName}
        onClose={closeModal}
        onConfirm={handleConfirm}
        isProcessing={modalState.isProcessing}
      />

      {/* باقی کد بدون تغییر */}
      <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-20">
            <a href="/products" class="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors font-medium group">
              <ArrowLeftIcon />
              <span class="hidden sm:inline">بازگشت به فروشگاه</span>
              <span class="sm:hidden">بازگشت</span>
            </a>
            
            <div class="flex items-center gap-4">
              <div class="relative">
                <div class="w-12 h-12 rounded-full bg-linear-to-br from-green-100 to-emerald-100 flex items-center justify-center shadow-sm">
                  <CartIcon />
                </div>
                {totalItems > 0 && (
                  <span class="absolute -top-1 -right-1 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                    {totalItems}
                  </span>
                )}
              </div>
              <div class="text-right">
                <h1 class="text-2xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  سبد خرید
                </h1>
                <p class="text-sm text-gray-500">محصولات انتخابی شما</p>
              </div>
            </div>
            
            <div class="hidden md:block">
              <div class="text-right">
                <p class="text-sm text-gray-600">قیمت موقت</p>
                <p class="text-lg font-bold text-gray-900">
                  {totalPrice.toLocaleString('fa-IR')} تومان
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!cart.loaded ? (
          <div class="flex flex-col items-center justify-center min-h-[500px] space-y-8">
            <div class="relative">
              <div class="w-24 h-24 border-4 border-gray-200 rounded-full"></div>
              <div class="absolute top-0 left-0 w-24 h-24 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div class="text-center space-y-2">
              <p class="text-xl font-bold text-gray-800">در حال بارگذاری سبد خرید...</p>
              <p class="text-gray-500">لطفاً چند لحظه صبر کنید</p>
            </div>
          </div>
        ) : cart.items.length === 0 ? (
          <div class="text-center py-20 sm:py-32">
            <div class="max-w-lg mx-auto">
              <div class="relative mx-auto mb-10">
                <div class="w-40 h-40 mx-auto bg-linear-to-br from-green-50 to-emerald-50 rounded-3xl flex items-center justify-center shadow-xl">
                  <CartIcon />
                </div>
              </div>
              <h2 class="text-3xl font-bold text-gray-900 mb-4">سبد خرید شما خالی است</h2>
              <p class="text-gray-600 mb-10 text-lg leading-relaxed max-w-md mx-auto">
                محصولات مورد علاقه خود را پیدا کنید و آنها را به سبد خرید اضافه کنید
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/Products" class="inline-flex items-center justify-center gap-3 px-10 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-1">
                  <CartIcon />
                  <span>مشاهده محصولات</span>
                  <ArrowRightIcon />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div class="lg:grid lg:grid-cols-12 lg:gap-8">
            <div class="lg:col-span-8">
              <div class="mb-10">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 class="text-2xl font-bold text-gray-900">محصولات انتخابی شما</h2>
                    <p class="text-gray-500 mt-1">{totalItems} آیتم در سبد خرید</p>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                      <CheckIcon />
                      <span class="font-medium">قابل ویرایش</span>
                    </div>
                    <button 
                      onClick$={openClearModal}
                      class="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <TrashIcon />
                      <span class="font-medium">خالی کردن سبد</span>
                    </button>
                  </div>
                </div>
                <div class="h-1.5 w-full bg-linear-to-r from-green-500 via-emerald-500 to-green-500 rounded-full opacity-80"></div>
              </div>

              <div class="space-y-6">
                {cart.items.map((item: any, index: number) => {
                  return (
                    <div key={item.id} class="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
                      <div class="p-6">
                        <div class="flex flex-col lg:flex-row gap-8">
                          <div class="relative w-full lg:w-48 h-48 shrink-0">
                            <div class="absolute inset-0 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                              {item.image ? (
                                <img
                                  src={item.image.startsWith('http') ? item.image : `${API_BASE_URL}${item.image}`}
                                  alt={item.name}
                                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                  onError$={(e) => {
                                    (e.target as HTMLImageElement).src = '/no-image.png';
                                  }}
                                />
                              ) : (
                                <div class="w-full h-full flex items-center justify-center">
                                  <PackageIcon />
                                </div>
                              )}
                            </div>
                            
                            {item.discount && (
                              <div class="absolute top-3 left-3">
                                <div class="bg-linear-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">
                                  {item.discount}% تخفیف
                                </div>
                              </div>
                            )}
                          </div>

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
                                          {Math.round((1 - item.price/item.originalPrice) * 100)}% صرفه‌جویی
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
                                        onClick$={() => updateQuantity(item.id, item.quantity - 1)} 
                                        disabled={item.quantity <= 1 || isUpdating.value === item.id} 
                                        class={`px-5 py-5 transition-all rounded-r-lg ${
                                          item.quantity <= 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 cursor-pointer'
                                        }`}
                                      >
                                        <MinusIcon />
                                      </button>
                                      
                                      <div class="px-6 py-3 bg-gray-50 min-w-20 text-center border-x">
                                        <span class="font-bold text-gray-900 text-lg">
                                          {isUpdating.value === item.id ? (
                                            <LoaderIcon />
                                          ) : (
                                            item.quantity
                                          )}
                                        </span>
                                      </div>
                                      
                                      <button 
                                        onClick$={() => updateQuantity(item.id, item.quantity + 1)} 
                                        disabled={isUpdating.value === item.id} 
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
                                    onClick$={() => openRemoveModal(item.id, item.name)}
                                    disabled={isRemoving.value === item.id} 
                                    class="flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold border border-red-200 hover:border-red-300 hover:shadow-md min-w-40 justify-center cursor-pointer"
                                  >
                                    {isRemoving.value === item.id ? (
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
                })}
              </div>

              <div class="mt-10 bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200 shadow-lg">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                  <div class="flex items-center gap-4">
                    <div class="w-14 h-14 bg-linear-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center shadow-lg">
                      <TruckIcon />
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-gray-900">حمل و نقل رایگان</h3>
                      <p class="text-gray-600 mt-1">
                        {totalPrice >= shippingThreshold 
                          ? 'تبریک! سفارش شما شامل حمل رایگان می‌شود 🎉'
                          : `فقط ${(shippingThreshold - totalPrice).toLocaleString('fa-IR')} تومان دیگر برای حمل رایگان`
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div class="text-right">
                    <div class="text-3xl font-bold text-green-600">
                      {Math.round((totalPrice / shippingThreshold) * 100)}%
                    </div>
                    <div class="text-sm text-gray-500">پیشرفت شما</div>
                  </div>
                </div>
                
                <div class="relative">
                  <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-linear-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min((totalPrice / shippingThreshold) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="lg:col-span-4 mt-10 lg:mt-0">
              <div class="sticky top-28">
                <div class="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  <div class="relative overflow-hidden">
                    <div class="absolute inset-0 bg-linear-to-r from-green-600 to-emerald-600 opacity-90"></div>
                    <div class="relative p-6">
                      <h2 class="text-2xl font-bold text-white mb-2">خلاصه سفارش</h2>
                      <p class="text-green-100">قیمت نهایی پس از ثبت سفارش محاسبه می‌شود</p>
                    </div>
                  </div>
                  
                  <div class="p-6">
                    <div class="space-y-4">
                      {[
                        { label: `قیمت کالاها (${totalItems} آیتم)`, value: totalPrice, color: 'text-gray-900' },
                        { label: 'هزینه حمل و نقل', value: shippingCost, color: shippingCost === 0 ? 'text-green-600' : 'text-gray-900' },
                        { label: 'مالیات و عوارض', value: estimatedTax, color: 'text-gray-900' },
                        { label: 'تخفیف', value: -discount, color: 'text-green-600' },
                      ].map((item, idx) => (
                        <div key={idx} class="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                          <span class="text-gray-600">{item.label}</span>
                          <span class={`font-semibold ${item.color}`}>
                            {item.value === 0 && idx === 1 ? 'رایگان' : `${Math.abs(item.value).toLocaleString('fa-IR')} تومان`}
                            {item.value < 0 && idx === 3 && ' -'}
                          </span>
                        </div>
                      ))}
                      
                      <div class="border-t border-gray-200 my-4"></div>
                      
                      <div class="flex justify-between items-center py-4 bg-linear-to-r from-gray-50 to-white rounded-xl px-4">
                        <div>
                          <span class="text-lg font-bold text-gray-900">مجموع قابل پرداخت</span>
                          <p class="text-sm text-gray-500 mt-1">شامل تمام هزینه‌ها</p>
                        </div>
                        <div class="text-right">
                          <div class="text-3xl font-bold text-gray-900">
                            {(totalPrice + shippingCost + estimatedTax - discount).toLocaleString('fa-IR')}
                          </div>
                          <div class="text-sm text-gray-500">تومان</div>
                        </div>
                      </div>
                    </div>
                    
                    <button onClick$={() => {
                      window.location.href = "/checkout";
                    }} class="mt-8 w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 group cursor-pointer">
                      <span class="text-lg">ادامه جهت تسویه حساب</span>
                      <ArrowRightIcon />
                    </button>
                    
                    <div class="mt-8 space-y-4">
                      <div class="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                        <ShieldIcon />
                        <div>
                          <p class="font-medium text-gray-900">پرداخت امن</p>
                          <p class="text-sm text-gray-600">اطلاعات شما محفوظ است</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="mt-6 bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 bg-linear-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <ReceiptIcon />
                    </div>
                    <div>
                      <p class="font-bold text-gray-900">نکات مهم:</p>
                      <ul class="mt-2 space-y-2 text-sm text-gray-600">
                        <li class="flex items-start gap-2">
                          <CheckIcon />
                          <span>امکان تغییر سفارش تا قبل از ارسال وجود دارد</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <CheckIcon />
                          <span>پشتیبانی ۲۴ ساعته در خدمت شماست</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
});