import type { Locale } from "@/types";

const translations = {
  ar: {
    home: "الرئيسية",
    products: "المنتجات",
    cart: "السلة",
    checkout: "إتمام الطلب",
    addToCart: "أضف للسلة",
    viewAll: "عرض الكل",
    featured: "منتجات مميزة",
    categories: "التصنيفات",
    emptyCart: "سلتك فارغة",
    subtotal: "المجموع الفرعي",
    discount: "الخصم",
    total: "الإجمالي",
    applyCoupon: "تطبيق الكوبون",
    couponPlaceholder: "أدخل كود الخصم",
    proceedCheckout: "إتمام الطلب عبر واتساب",
    customerName: "الاسم",
    customerPhone: "رقم الجوال",
    quantity: "الكمية",
    remove: "حذف",
    orderViaWhatsapp: "أرسل الطلب عبر واتساب",
    deliveryApps: "تطبيقات التوصيل",
    location: "موقعنا",
    shopNow: "تسوق الآن",
    allProducts: "جميع المنتجات",
    noProducts: "لا توجد منتجات",
    relatedProducts: "قد يعجبك أيضاً",
    outOfStock: "غير متوفر",
    sar: "ر.س",
    language: "English",
  },
  en: {
    home: "Home",
    products: "Products",
    cart: "Cart",
    checkout: "Checkout",
    addToCart: "Add to Cart",
    viewAll: "View All",
    featured: "Featured",
    categories: "Categories",
    emptyCart: "Your cart is empty",
    subtotal: "Subtotal",
    discount: "Discount",
    total: "Total",
    applyCoupon: "Apply Coupon",
    couponPlaceholder: "Enter coupon code",
    proceedCheckout: "Checkout via WhatsApp",
    customerName: "Name",
    customerPhone: "Phone",
    quantity: "Qty",
    remove: "Remove",
    orderViaWhatsapp: "Send order via WhatsApp",
    deliveryApps: "Delivery Apps",
    location: "Our Location",
    shopNow: "Shop Now",
    allProducts: "All Products",
    noProducts: "No products found",
    relatedProducts: "You may also like",
    outOfStock: "Unavailable",
    sar: "SAR",
    language: "العربية",
  },
} as const;

export type TranslationKey = keyof typeof translations.ar;

export function t(key: TranslationKey, locale: Locale): string {
  return translations[locale][key];
}

export function localizedName(
  name: string,
  nameEn: string,
  locale: Locale
): string {
  return locale === "ar" ? name : nameEn || name;
}

export function localizedDescription(
  description: string,
  descriptionEn: string | null | undefined,
  locale: Locale
): string {
  if (locale === "en" && descriptionEn) return descriptionEn;
  return description;
}
