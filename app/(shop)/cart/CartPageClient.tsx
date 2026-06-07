"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useLocaleStore } from "@/store/locale-store";
import { formatPrice } from "@/lib/utils";
import { localizedName, t } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { validateCoupon } from "@/server/actions/coupon";

export function CartPageClient() {
  const locale = useLocaleStore((s) => s.locale);
  const { items, coupon, updateQuantity, removeItem, setCoupon, clearCoupon, getSubtotal, getTotal } =
    useCartStore();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = getSubtotal();
  const total = getTotal();

  const applyCoupon = async () => {
    setCouponError("");
    setLoading(true);
    const result = await validateCoupon(couponInput, subtotal);
    setLoading(false);
    if (result.valid) {
      setCoupon({ code: result.code!, discount: result.discount });
    } else {
      setCouponError(result.message ?? "كوبون غير صالح");
      clearCoupon();
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="font-display text-3xl font-bold">{t("cart", locale)}</h1>
        <p className="mt-4 text-text/60">{t("emptyCart", locale)}</p>
        <Link href="/products" className="mt-8 inline-block">
          <Button variant="accent">{t("shopNow", locale)}</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-3xl font-bold">{t("cart", locale)}</h1>

      <ul className="mt-8 space-y-6">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex gap-4 rounded-luxury-lg bg-white p-4 shadow-soft"
          >
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-luxury bg-beige">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="font-semibold">
                  {localizedName(item.name, item.nameEn, locale)}
                </h3>
                <p className="text-accent font-bold">
                  {formatPrice(item.price, locale === "ar" ? "ar-SA" : "en-SA")}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-luxury border border-beige">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="px-3 py-1"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="px-3 py-1"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="text-sm text-red-500 hover:underline"
                >
                  {t("remove", locale)}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded-luxury-lg bg-white p-6 shadow-soft">
        <div className="flex gap-2">
          <Input
            placeholder={t("couponPlaceholder", locale)}
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            error={couponError}
          />
          <Button variant="outline" onClick={applyCoupon} loading={loading}>
            {t("applyCoupon", locale)}
          </Button>
        </div>
        {coupon && (
          <p className="mt-2 text-sm text-green-600">
            {coupon.code}: -{formatPrice(coupon.discount)}
          </p>
        )}

        <div className="mt-6 space-y-2 border-t border-beige pt-4">
          <div className="flex justify-between">
            <span>{t("subtotal", locale)}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {coupon && (
            <div className="flex justify-between text-green-600">
              <span>{t("discount", locale)}</span>
              <span>-{formatPrice(coupon.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold">
            <span>{t("total", locale)}</span>
            <span className="text-accent">{formatPrice(total)}</span>
          </div>
        </div>

        <Link href="/checkout" className="mt-6 block">
          <Button variant="accent" size="lg" className="w-full">
            {t("proceedCheckout", locale)}
          </Button>
        </Link>
      </div>
    </>
  );
}
