"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useLocaleStore } from "@/store/locale-store";
import { formatPrice } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { processCheckout } from "@/server/actions/checkout";
import Link from "next/link";

export function CheckoutPageClient() {
  const locale = useLocaleStore((s) => s.locale);
  const { items, coupon, getSubtotal, getTotal, clearCart } = useCartStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = getSubtotal();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-text/60">{t("emptyCart", locale)}</p>
        <Link href="/products" className="mt-6 inline-block">
          <Button variant="accent">{t("shopNow", locale)}</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await processCheckout({
      customerName: name,
      customerPhone: phone,
      couponCode: coupon?.code,
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        nameEn: i.nameEn,
        price: i.price,
        quantity: i.quantity,
      })),
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    clearCart();
    window.location.href = result.whatsappUrl;
  };

  return (
    <>
      <h1 className="font-display text-3xl font-bold">{t("checkout", locale)}</h1>
      <p className="mt-2 text-text/60">{t("orderViaWhatsapp", locale)}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <Input
          id="name"
          label={t("customerName", locale)}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          id="phone"
          label={t("customerPhone", locale)}
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="05xxxxxxxx"
        />

        <div className="rounded-luxury-lg bg-white p-4 shadow-soft space-y-2">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-beige pt-2 flex justify-between font-bold">
            <span>{t("total", locale)}</span>
            <span className="text-accent">{formatPrice(total)}</span>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" variant="accent" size="lg" className="w-full" loading={loading}>
          {t("orderViaWhatsapp", locale)}
        </Button>
      </form>
    </>
  );
}
