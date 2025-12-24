import { component$ } from "@builder.io/qwik";
import type { OrderItem } from "~/components/types/order";

export const OrderItems = component$<{ items: OrderItem[] }>(({ items }) => {
  return (
    <div class="mt-2 space-y-2 bg-gray-50 p-3 rounded-lg">
      {items.map((item, i) => (
        <div key={i} class="flex justify-between text-sm">
          <div>
            {item.product.name}
            <span class="text-xs text-gray-500">
              {" "}
              ({item.product.packageSize})
            </span>
          </div>
          <div>
            {item.quantity} × {item.price.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
});