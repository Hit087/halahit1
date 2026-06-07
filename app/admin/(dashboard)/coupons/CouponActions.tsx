"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  updateCoupon,
  deleteCoupon,
  toggleCouponActive,
} from "@/server/actions/admin-coupons";
import type { Coupon } from "@prisma/client";
import { decimalToNumber } from "@/lib/utils";

export function CouponActions({ coupon }: { coupon: Coupon }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await updateCoupon(coupon.id, formData);
    setEditing(false);
    router.refresh();
  };

  if (editing) {
    return (
      <form onSubmit={handleUpdate} className="mt-4 space-y-2 border-t border-beige pt-4">
        <Input name="code" defaultValue={coupon.code} label="الكود" />
        <select name="type" defaultValue={coupon.type} className="w-full rounded-luxury border border-beige px-3 py-2 text-sm">
          <option value="PERCENTAGE">نسبة</option>
          <option value="FIXED">ثابت</option>
        </select>
        <Input name="value" type="number" defaultValue={decimalToNumber(coupon.value)} label="القيمة" />
        <Input
          name="expiresAt"
          type="date"
          defaultValue={coupon.expiresAt?.toISOString().split("T")[0] ?? ""}
          label="الانتهاء"
        />
        <input type="hidden" name="active" value={coupon.active ? "true" : "false"} />
        <div className="flex gap-2">
          <Button type="submit" size="sm" variant="accent">حفظ</Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>
            إلغاء
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="mt-3 flex gap-2">
      <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
        تعديل
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={async () => {
          await toggleCouponActive(coupon.id, !coupon.active);
          router.refresh();
        }}
      >
        {coupon.active ? "تعطيل" : "تفعيل"}
      </Button>
      <button
        type="button"
        className="text-sm text-red-500"
        onClick={async () => {
          if (!confirm("حذف الكوبون؟")) return;
          await deleteCoupon(coupon.id);
          router.refresh();
        }}
      >
        حذف
      </button>
    </div>
  );
}
