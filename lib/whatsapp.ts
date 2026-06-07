import { formatPrice } from "./utils";

export type WhatsAppLineItem = {
  name: string;
  nameEn?: string;
  quantity: number;
  price: number;
};

export function buildWhatsAppMessage(params: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: WhatsAppLineItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  storeName?: string;
}): string {
  const {
    orderNumber,
    customerName,
    customerPhone,
    items,
    subtotal,
    discount,
    total,
    couponCode,
    storeName = "Hit | هيت",
  } = params;

  const lines: string[] = [
    `🍰 *طلب جديد من ${storeName}*`,
    `━━━━━━━━━━━━━━`,
    `📋 رقم الطلب: *${orderNumber}*`,
    `👤 الاسم: ${customerName}`,
    `📱 الجوال: ${customerPhone}`,
    ``,
    `🛒 *تفاصيل الطلب:*`,
  ];

  items.forEach((item, i) => {
    const lineTotal = item.price * item.quantity;
    lines.push(
      `${i + 1}. ${item.name}`,
      `   الكمية: ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(lineTotal)}`
    );
  });

  lines.push(
    ``,
    `━━━━━━━━━━━━━━`,
    `💰 المجموع الفرعي: ${formatPrice(subtotal)}`
  );

  if (discount > 0) {
    lines.push(
      `🏷️ الخصم${couponCode ? ` (${couponCode})` : ""}: -${formatPrice(discount)}`
    );
  }

  lines.push(
    `✨ *الإجمالي: ${formatPrice(total)}*`,
    ``,
    `شكراً لاختياركم هيت! 💕`
  );

  return lines.join("\n");
}

export function getWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
