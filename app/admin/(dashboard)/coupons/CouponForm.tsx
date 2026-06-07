"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { createCoupon } from "@/server/actions/admin-coupons";

export function CouponForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createCoupon(formData);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? "حدث خطأ");
      return;
    }
    router.refresh();
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Card>
      <h2 className="font-semibold mb-4">إضافة كوبون</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input name="code" label="الكود" required placeholder="HIT10" />
        <div>
          <label className="text-sm font-medium">النوع</label>
          <select name="type" className="mt-1 w-full rounded-luxury border border-beige px-4 py-3">
            <option value="PERCENTAGE">نسبة مئوية</option>
            <option value="FIXED">مبلغ ثابت</option>
          </select>
        </div>
        <Input name="value" type="number" step="0.01" label="القيمة" required />
        <Input name="expiresAt" type="date" label="تاريخ الانتهاء (اختياري)" />
        <label className="flex items-center gap-2 text-sm">
          <input type="hidden" name="active" value="false" />
          <input type="checkbox" name="active" value="true" defaultChecked />
          مفعّل
        </label>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" variant="accent" loading={loading}>
          إضافة
        </Button>
      </form>
    </Card>
  );
}
