"use client";

import { deleteCategory } from "@/server/actions/admin-categories";
import { useRouter } from "next/navigation";

export function DeleteCategoryButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="mt-2 text-xs text-red-500 hover:underline"
      onClick={async () => {
        if (!confirm("حذف التصنيف؟")) return;
        const result = await deleteCategory(id);
        if (!result.success) alert(result.error);
        router.refresh();
      }}
    >
      حذف
    </button>
  );
}
