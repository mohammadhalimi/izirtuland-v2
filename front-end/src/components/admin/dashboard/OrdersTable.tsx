import { $, component$ } from "@builder.io/qwik";
import type { Order } from "~/components/types/order";
import { OrderItems } from "./OrderItems";
import { StatusBadge } from "./StatusBadge";
import { API_BASE_URL } from "~/config/api";

export const OrdersTable = component$<{
  orders: Order[];
  authToken: string;
}>(({ orders, authToken }) => {

  const updateStatus = $(async (orderId: string) => {
    if (!confirm("آیا از تکمیل این سفارش اطمینان دارید؟")) return;

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
      alert("خطا در تغییر وضعیت سفارش");
      return;
    }

    alert("✅ سفارش با موفقیت تکمیل شد");
    window.location.reload();
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

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
                        class="bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <span>تکمیل سفارش</span>
                        <span class="text-lg">✅</span>
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
  );
});