// src/routes/Card/index.tsx
import { $, component$, useContext, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { ConfirmationModal } from "~/components/ui/cards/confirmation-modal";
import { CartContext } from "~/context/cart-context";
import { Notification } from "~/components/ui/cards/notification";
import CartHeader from "~/components/Card/CartHeader";
import CartItem from "~/components/Card/CartItem";
import CartSummary from "~/components/Card/CartSummary";
import ShippingProgress from "~/components/Card/ShippingProgress";
import EmptyCart from "~/components/Card/EmptyCart";
import LoadingCart from "~/components/Card/LoadingCart";
import CartActions from "~/components/Card/CartActions"

export default component$(() => {
  const cart = useContext(CartContext);
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

  // استفاده از signal برای ذخیره مقادیر
  const cartTotals = useStore({
    totalPrice: 0,
    totalUnits: 0,
    uniqueProducts: 0
  });

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

  // به‌روزرسانی خودکار مقادیر هنگام تغییر سبد خرید
  useTask$(({ track }) => {
    track(() => {
      return cart.items.map(item => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity
      }));
    });

    if (!cart.items || cart.items.length === 0) {
      cartTotals.totalPrice = 0;
      cartTotals.totalUnits = 0;
      cartTotals.uniqueProducts = 0;
    } else {
      cartTotals.totalPrice = cart.items.reduce((sum: number, item: any) =>
        sum + (item.price * item.quantity), 0);
      cartTotals.totalUnits = cart.items.reduce((sum: number, item: any) =>
        sum + item.quantity, 0);
      cartTotals.uniqueProducts = cart.items.length;
    }
  });

  // تابع نمایش notification
  const showNotification = $((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    notificationState.show = true;
    notificationState.message = message;
    notificationState.type = type;
    setTimeout(() => { notificationState.show = false; }, 4000);
  });

  // تابع بستن notification
  const closeNotification = $(() => { notificationState.show = false; });

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
    } catch {
      showNotification('خطا در حذف محصول', 'error');
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
    } catch {
      showNotification('خطا در خالی کردن سبد خرید', 'error');
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
    } catch {
      showNotification('خطا در به‌روزرسانی تعداد', 'error');
    } finally {
      isUpdating.value = null;
    }
  });

  // محاسبه هزینه‌ها
  const shippingThreshold = 10000000;
  const isFreeShipping = cartTotals.totalPrice >= shippingThreshold;

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

      <CartHeader
        uniqueProducts={cartTotals.uniqueProducts}
        totalUnits={cartTotals.totalUnits}
        totalPrice={cartTotals.totalPrice}
      />

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!cart.loaded ? (
          <LoadingCart />
        ) : cart.items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div class="lg:grid lg:grid-cols-12 lg:gap-8">
            <div class="lg:col-span-8">
              <CartActions
                uniqueProducts={cartTotals.uniqueProducts}
                totalUnits={cartTotals.totalUnits}
                onClearCart={openClearModal}
              />

              <div class="space-y-6">
                {cart.items.map((item: any) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    isUpdating={isUpdating.value === item.id}
                    onUpdateQuantity={updateQuantity}
                    onRemove={openRemoveModal}
                    formatPackageSize={formatPackageSize}
                  />
                ))}
              </div>

              <div class="mt-10">
                <ShippingProgress
                  totalPrice={cartTotals.totalPrice}
                  shippingThreshold={shippingThreshold}
                />
              </div>
            </div>

            <div class="lg:col-span-4 mt-10 lg:mt-0">
              <CartSummary
                totalPrice={cartTotals.totalPrice}
                totalUnits={cartTotals.totalUnits}
                isFreeShipping={isFreeShipping}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
});