import { component$, Resource, useResource$ } from "@builder.io/qwik";
import type { Order } from "~/components/types/order";
import { OrdersTable } from "./OrdersTable";
import { API_BASE_URL } from "~/config/api";

interface OrdersProps {
  authToken: string;
}

export default component$<OrdersProps>(({ authToken }) => {

  const ordersResource = useResource$<Order[]>(async ({ cleanup }) => {
    const controller = new AbortController();
    cleanup(() => controller.abort());

    const res = await fetch(`${API_BASE_URL}/api/admin/orders`, {
      credentials: "include",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      throw new Error("خطا در دریافت سفارشات");
    }

    const data = await res.json();
    return data.orders;
  });

  return (
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">📦 سفارشات کاربران</h1>

      <Resource
        value={ordersResource}
        onPending={() => <p>در حال بارگذاری...</p>}
        onRejected={(err) => (
          <p class="text-red-600">{err.message}</p>
        )}
        onResolved={(orders) => (
          <OrdersTable orders={orders} authToken={authToken}/>
        )}
      />
    </div>
  );
});
