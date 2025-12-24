import { component$ } from "@builder.io/qwik";
import type { Order } from "~/components/types/order";
import { OrderItems } from "./OrderItems";
import { StatusBadge } from "./StatusBadge";
interface Props {
  orders: Order[];
}

export const OrdersTable = component$<Props>(({ orders }) => {
  if (!orders.length) {
    return (
      <div class="bg-yellow-50 p-6 rounded-xl text-center">
        هیچ سفارشی ثبت نشده
      </div>
    );
  }

  return (
    <div class="overflow-x-auto bg-white rounded-xl shadow">
      <table class="w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3 text-right">کاربر</th>
            <th class="p-3 text-right">مبلغ</th>
            <th class="p-3 text-right">وضعیت</th>
            <th class="p-3 text-right">تاریخ</th>
            <th class="p-3 text-right">جزئیات</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order._id} class="border-t">
              <td class="p-3">
                <div class="font-medium">
                  {order.user?.name || "بدون نام"}
                </div>
                <div class="text-xs text-gray-500">
                  {order.user.phone}
                </div>
              </td>

              <td class="p-3 font-bold">
                {order.totalPrice.toLocaleString()} تومان
              </td>

              <td class="p-3">
                <StatusBadge status={order.status} />
              </td>

              <td class="p-3">
                {new Date(order.createdAt).toLocaleDateString("fa-IR")}
              </td>

              <td class="p-3">
                <details class="cursor-pointer">
                  <summary class="text-blue-600">مشاهده</summary>
                  <OrderItems items={order.items} />
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
