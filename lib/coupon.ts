import { Coupon, CouponType } from "@prisma/client";
import { decimalToNumber } from "./utils";

export type DiscountResult = {
  valid: boolean;
  discount: number;
  message?: string;
  coupon?: Coupon;
};

export function calculateDiscount(
  coupon: Coupon,
  subtotal: number
): DiscountResult {
  if (!coupon.active) {
    return { valid: false, discount: 0, message: "الكوبون غير مفعّل" };
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { valid: false, discount: 0, message: "انتهت صلاحية الكوبون" };
  }

  const value = decimalToNumber(coupon.value);
  let discount = 0;

  if (coupon.type === CouponType.PERCENTAGE) {
    if (value > 100) {
      return { valid: false, discount: 0, message: "نسبة الخصم غير صالحة" };
    }
    discount = (subtotal * value) / 100;
  } else {
    discount = Math.min(value, subtotal);
  }

  return {
    valid: true,
    discount: Math.round(discount * 100) / 100,
    coupon,
  };
}
