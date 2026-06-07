"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { useLocaleStore } from "@/store/locale-store";
import { localizedName, t } from "@/lib/i18n";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/Button";
import type { ProductWithImages } from "@/types";

export function ProductCard({ product }: { product: ProductWithImages }) {
  const locale = useLocaleStore((s) => s.locale);
  const addItem = useCartStore((s) => s.addItem);
  const image = product.images[0]?.url ?? "/uploads/placeholder.svg";

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      nameEn: product.nameEn,
      price: product.price ?? 0,
      image,
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group overflow-hidden rounded-luxury-lg bg-white shadow-soft transition hover:shadow-soft-lg"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-beige/30">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-display text-lg font-semibold text-text transition hover:text-accent">
            {localizedName(product.name, product.nameEn, locale)}
          </h3>
        </Link>

        <p className="mt-2 text-lg font-bold text-accent">
          {product.price
            ? formatPrice(product.price, locale === "ar" ? "ar-SA" : "en-SA")
            : locale === "ar" ? "السعر حسب الطلب" : "Price on request"}
        </p>

        {product.price ? (
          <Button
            variant="primary"
            size="sm"
            className="mt-4 w-full"
            onClick={handleAdd}
          >
            {t("addToCart", locale)}
          </Button>
        ) : (
          <Link href={`/products/${product.id}`}>
            <Button variant="ghost" size="sm" className="mt-4 w-full">
              {locale === "ar" ? "تواصل معنا" : "Contact us"}
            </Button>
          </Link>
        )}
      </div>
    </motion.article>
  );
}