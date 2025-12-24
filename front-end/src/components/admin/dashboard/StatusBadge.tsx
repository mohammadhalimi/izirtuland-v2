import { component$ } from "@builder.io/qwik";

type OrderStatus = 'iscompleted' | 'paid' | 'failed';

export const StatusBadge = component$<{ status: OrderStatus }>(({ status }) => {
  const map: Record<OrderStatus, string> = {
    iscompleted: "bg-green-100 text-green-800",
    paid: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  };

  const textMap: Record<OrderStatus, string> = {
    iscompleted: "تکمیل شده",
    paid: "در انتظار",
    failed: "ناموفق",
  };

  return (
    <span class={`px-3 py-1 rounded-full text-xs ${map[status]}`}>
      {textMap[status]}
    </span>
  );
});
