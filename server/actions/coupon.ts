"use server";

import { prisma } from "@/lib/prisma";
import { calculateDiscount } from "@/lib/coupon";
import { couponApplySchema } from "@/lib/validations";

export async function validateCoupon(code: string, subtotal: number) {
  const parsed = couponApplySchema.safeParse({ code, subtotal });
  if (!parsed.success) {
    return { valid: false, discount: 0, message: "بيانات غير صالحة" };
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: parsed.data.code.toUpperCase() },
  });

  if (!coupon) {
    return { valid: false, discount: 0, message: "كود الخصم غير موجود" };
  }

  const result = calculateDiscount(coupon, subtotal);
  return {
    valid: result.valid,
    discount: result.discount,
    message: result.message,
    code: coupon.code,
  };
}
