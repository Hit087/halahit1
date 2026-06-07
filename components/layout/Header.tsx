"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";
import { useLocaleStore } from "@/store/locale-store";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Header({ logo, storeName }: { logo?: string | null; storeName: string }) {
  const itemCount = useCartStore((s) => s.getItemCount());
  const { locale, toggleLocale } = useLocaleStore();
  const isRtl = locale === "ar";

  return (
    <header className="sticky top-0 z-50 border-b border-beige/60 bg-cream/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          {logo ? (
            <Image
              src={logo}
              alt={storeName}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-text">
              ه
            </span>
          )}
          <span className="font-display text-xl font-semibold text-text">{storeName}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-text/80 transition hover:text-accent">
            {t("home", locale)}
          </Link>
          <Link href="/products" className="text-text/80 transition hover:text-accent">
            {t("products", locale)}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleLocale}
            className="rounded-luxury px-3 py-2 text-sm font-medium text-text/80 transition hover:bg-beige"
          >
            {t("language", locale)}
          </button>
          <Link
            href="/cart"
            className={cn(
              "relative flex items-center gap-2 rounded-luxury bg-primary px-4 py-2 text-sm font-medium text-text transition hover:bg-primary/90"
            )}
            dir={isRtl ? "rtl" : "ltr"}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="hidden sm:inline">{t("cart", locale)}</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
