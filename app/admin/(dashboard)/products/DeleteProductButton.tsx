"use client";

import { deleteProduct } from "@/server/actions/admin-products";
import { useRouter } from "next/navigation";

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="text-sm text-red-500 hover:underline px-2"
      onClick={async () => {
        if (!confirm("حذف هذا المنتج؟")) return;
        await deleteProduct(id);
        router.refresh();
      }}
    >
      حذف
    </button>
  );
}
