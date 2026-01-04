import { $, component$, QRL, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { Order } from "~/components/types/order";
import { OrderItems } from "./OrderItems";
import { StatusBadge } from "./StatusBadge";
import { API_BASE_URL } from "~/config/api";
import { formatDate, formatPrice } from "~/components/function/function";
import { ConfirmDialog } from "./ConfirmDialog";
import { Notification } from "./Notification";

export const OrdersTable = component$<{
  orders: Order[];
  authToken: string;
  onOrderUpdated?: QRL<() => void>;
}>(({ orders, authToken, onOrderUpdated }) => {
  // State برای نوتیفیکیشن
  const notificationState = useSignal({
    show: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    message: ''
  });

  // State برای دایالوگ تایید
  const confirmDialogState = useSignal({
    show: false,
    title: '',
    message: '',
    orderId: ''
  });

  // State برای وضعیت لودینگ
  const updatingStatus = useSignal<string | null>(null);

  // تابع نمایش دایالوگ تایید
  const showConfirmDialog = $((orderId: string, title: string, message: string) => {
    confirmDialogState.value = {
      show: true,
      title,
      message,
      orderId
    };
  });

  // تابع اصلی آپدیت وضعیت
  const updateStatus = $(async (orderId: string) => {
    // نمایش دایالوگ تایید
    showConfirmDialog(
      orderId,
      "تایید سفارش",
      "آیا از تکمیل این سفارش اطمینان دارید؟"
    );
  });

  // یک signal برای ذخیره پیام نوتیفیکیشن که باید بعد از mount نمایش داده شود
  const pendingNotification = useSignal<{ type: 'success' | 'error', message: string } | null>(null);

  // بعد از هر render، اگر pendingNotification داریم، نمایشش بده
  useVisibleTask$(({ track }) => {
    track(() => pendingNotification.value);

    if (pendingNotification.value) {
      // کمی تاخیر برای اطمینان از render کامل
      setTimeout(() => {
        notificationState.value = {
          show: true,
          type: pendingNotification.value!.type,
          message: pendingNotification.value!.message
        };
        pendingNotification.value = null;
      }, 50);
    }
  });

  // تابع handleConfirm اصلاح شده
  const handleConfirm = $(async () => {
    const { orderId } = confirmDialogState.value;

    if (!orderId) return;

    updatingStatus.value = orderId;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/orders/orders/${orderId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ status: "iscompleted" }),
        }
      );

      if (!res.ok) {
        throw new Error("خطا در تغییر وضعیت سفارش");
      }

      // ذخیره پیام نوتیفیکیشن برای نمایش بعد از re-render
      pendingNotification.value = {
        type: 'success',
        message: "✅ سفارش با موفقیت تکمیل شد"
      };

      // parent را آپدیت کن
      if (onOrderUpdated) {
        onOrderUpdated();
      }

    } catch (error) {
      pendingNotification.value = {
        type: 'error',
        message: error instanceof Error ? error.message : "خطا در تغییر وضعیت سفارش"
      };

      // در صورت خطا هم parent را آپدیت کن (برای دریافت لیست جدید)
      if (onOrderUpdated) {
        onOrderUpdated();
      }
    } finally {
      updatingStatus.value = null;
      confirmDialogState.value = { show: false, title: '', message: '', orderId: '' };
    }
  });
  // تابع لغو از دایالوگ
  const handleCancel = $(() => {
    confirmDialogState.value = { show: false, title: '', message: '', orderId: '' };
  });

  if (orders.length === 0) {
    return (
      <div class="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <div class="text-5xl mb-4">📭</div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">سفارشی یافت نشد</h3>
        <p class="text-gray-500">هنوز هیچ سفارشی ثبت نشده است</p>
      </div>
    );
  }

  return (
    <>
      {/* Notification */}
      <Notification
        isVisible={notificationState.value.show}
        type={notificationState.value.type}
        message={notificationState.value.message}
        onClose={$( // <-- اینجا با $ wrap کنید
          () => {
            notificationState.value = { ...notificationState.value, show: false };
            // تابع هیچ چیزی برنمی‌گرداند (void)
          }
        )}
        duration={3000}
      />
      {/* Confirm Dialog */}
      <ConfirmDialog
        isVisible={confirmDialogState.value.show}
        title={confirmDialogState.value.title}
        message={confirmDialogState.value.message}
        confirmText="تکمیل سفارش"
        cancelText="لغو"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Table Header */}
        <div class="px-6 py-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-800">لیست سفارشات</h3>
            <div class="text-sm text-gray-500">
              <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {orders.length} سفارش
              </span>
            </div>
          </div>
        </div>

        {/* Responsive Table Container */}
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="py-4 px-6 text-right font-semibold text-gray-700 text-sm">اطلاعات مشتری</th>
                <th class="py-4 px-6 text-right font-semibold text-gray-700 text-sm">مبلغ سفارش</th>
                <th class="py-4 px-6 text-right font-semibold text-gray-700 text-sm">وضعیت</th>
                <th class="py-4 px-6 text-right font-semibold text-gray-700 text-sm">تاریخ ثبت</th>
                <th class="py-4 px-6 text-right font-semibold text-gray-700 text-sm">عملیات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  class="hover:bg-green-50/30 transition-colors duration-200 group"
                >
                  {/* Customer Info Column */}
                  <td class="py-5 px-6">
                    <div class="space-y-2">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span class="text-green-700">👤</span>
                        </div>
                        <div>
                          <div class="font-medium text-gray-900">
                            {order.user?.name || "نامشخص"}
                          </div>
                          <div class="text-sm text-gray-500 dir-ltr">
                            {order.user?.phone || "—"}
                          </div>
                        </div>
                      </div>
                      {order.user?.address && (
                        <div class="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <div class="flex items-start gap-2">
                            <span class="text-gray-400 mt-0.5">📍</span>
                            <span class="text-right">{order.user.address}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Price Column */}
                  <td class="py-5 px-6">
                    <div class="text-left">
                      <div class="text-xl font-bold text-green-700">
                        {formatPrice(order.totalPrice)}
                        <span class="text-sm font-normal mr-1">تومان</span>
                      </div>
                      <div class="text-sm text-gray-500 mt-1">
                        شناسه: {order._id.slice(-8)}
                      </div>
                    </div>
                  </td>

                  {/* Status Column */}
                  <td class="py-5 px-6">
                    <div class="flex flex-col gap-2">
                      <StatusBadge status={order.status} />
                      {order.payment?.trackId && (
                        <div class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          پیگیری: {order.payment.trackId}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Date Column */}
                  <td class="py-5 px-6">
                    <div class="space-y-1">
                      <div class="text-gray-900 font-medium">
                        {formatDate(order.createdAt)}
                      </div>
                      {order.payment?.paidAt && (
                        <div class="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                          <span class="ml-1">💰</span>
                          پرداخت شده
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td class="py-5 px-6">
                    <div class="flex flex-col gap-3">
                      {/* Complete Order Button */}
                      {order.status === "paid" && (
                        <button
                          onClick$={() => updateStatus(order._id)}
                          disabled={updatingStatus.value === order._id}
                          class={`
                            bg-linear-to-r from-green-500 to-emerald-600 
                            hover:from-green-600 hover:to-emerald-700 
                            text-white px-4 py-2 rounded-lg font-medium 
                            transition-all duration-300 hover:shadow-lg 
                            flex items-center justify-center gap-2
                            ${updatingStatus.value === order._id ? 'opacity-70 cursor-not-allowed' : ''}
                          `}
                        >
                          {updatingStatus.value === order._id ? (
                            <>
                              <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                              <span>در حال پردازش...</span>
                            </>
                          ) : (
                            <>
                              <span>تکمیل سفارش</span>
                              <span class="text-lg">✅</span>
                            </>
                          )}
                        </button>
                      )}

                      {/* View Items Accordion */}
                      <details class="group/details">
                        <summary class="cursor-pointer list-none">
                          <div class="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                            <span>مشاهده اقلام</span>
                            <svg
                              class="w-4 h-4 transform group-open/details:rotate-180 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </summary>
                        <div class="mt-3 bg-gray-50 rounded-xl border border-gray-200 p-4 animate-fadeIn">
                          <OrderItems items={order.items} />
                        </div>
                      </details>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
});