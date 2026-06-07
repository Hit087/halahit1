"use server";

import { prisma } from "@/lib/prisma";
import { calculateDiscount } from "@/lib/coupon";
import { buildWhatsAppMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import { generateOrderNumber } from "@/lib/utils";
import { checkoutSchema } from "@/lib/validations";
import { trackEvent } from "@/server/analytics";

export async function processCheckout(data: unknown) {
  const parsed = checkoutSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, error: "بيانات الطلب غير صالحة" };
  }

  const { customerName, customerPhone, couponCode, items } = parsed.data;

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  if (products.length !== productIds.length) {
    return { success: false as const, error: "بعض المنتجات غير متوفرة" };
  }

  const validatedItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const price = Number(product.price);
    return {
      productId: product.id,
      name: product.name,
      nameEn: product.nameEn,
      price,
      quantity: item.quantity,
    };
  });

  const subtotal = validatedItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  let discount = 0;
  let appliedCoupon: string | undefined;

  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode.toUpperCase() },
    });
    if (!coupon) {
      return { success: false as const, error: "كود الخصم غير صالح" };
    }
    const result = calculateDiscount(coupon, subtotal);
    if (!result.valid) {
      return { success: false as const, error: result.message ?? "كوبون غير صالح" };
    }
    discount = result.discount;
    appliedCoupon = coupon.code;
  }

  const total = Math.max(0, subtotal - discount);
  const orderNumber = generateOrderNumber();

  const settings = await prisma.settings.findUnique({
    where: { id: "default" },
  });

  const whatsappMessage = buildWhatsAppMessage({
    orderNumber,
    customerName,
    customerPhone,
    items: validatedItems,
    subtotal,
    discount,
    total,
    couponCode: appliedCoupon,
    storeName: settings?.storeName,
  });

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName,
      customerPhone,
      subtotal,
      discount,
      total,
      couponCode: appliedCoupon,
      whatsappMessage,
      items: {
        create: validatedItems.map((item) => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });

  await trackEvent("ORDER", "/checkout", undefined, { orderId: order.id });

  const whatsappUrl = getWhatsAppUrl(
    settings?.whatsappNumber ?? "966500000000",
    whatsappMessage
  );

  return {
    success: true as const,
    orderId: order.id,
    orderNumber,
    whatsappUrl,
    total,
  };
}
