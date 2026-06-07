"use client";

import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/server/actions/admin-orders";
import { OrderStatus } from "@prisma/client";

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const router = useRouter();

  return (
    <div className="mt-4 flex items-center gap-2">
      <label className="text-sm font-medium">تحديث الحالة:</label>
      <select
        value={status}
        onChange={async (e) => {
          await updateOrderStatus(orderId, e.target.value as OrderStatus);
          router.refresh();
        }}
        className="rounded-luxury border border-beige px-3 py-1.5 text-sm"
      >
        <option value="PENDING">قيد الانتظار</option>
        <option value="CONFIRMED">مؤكد</option>
        <option value="DELIVERED">تم التوصيل</option>
        <option value="CANCELLED">ملغي</option>
      </select>
    </div>
  );
}
