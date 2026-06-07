import { prisma } from "@/lib/prisma";
import { decimalToNumber, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { CouponForm } from "./CouponForm";
import { CouponActions } from "./CouponActions";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">الكوبونات</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <CouponForm />
        <div className="space-y-4">
          {coupons.map((c) => (
            <div key={c.id} className="rounded-luxury-lg bg-white p-4 shadow-soft">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono font-bold text-lg">{c.code}</p>
                  <p className="text-sm text-text/60 mt-1">
                    {c.type === "PERCENTAGE"
                      ? `${decimalToNumber(c.value)}%`
                      : formatPrice(decimalToNumber(c.value))}
                  </p>
                  {c.expiresAt && (
                    <p className="text-xs text-text/50 mt-1">
                      ينتهي: {c.expiresAt.toLocaleDateString("ar-SA")}
                    </p>
                  )}
                </div>
                <Badge variant={c.active ? "success" : "muted"}>
                  {c.active ? "مفعّل" : "معطّل"}
                </Badge>
              </div>
              <CouponActions coupon={c} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
