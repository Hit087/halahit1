"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { couponSchema } from "@/lib/validations";

async function guard() {
  const session = await requireAdmin();
  if (!session) throw new Error("غير مصرح");
}

export async function createCoupon(formData: FormData) {
  await guard();

  const raw = {
    code: formData.get("code"),
    type: formData.get("type"),
    value: formData.get("value"),
    expiresAt: formData.get("expiresAt") || null,
    active: formData.get("active") === "true",
  };

  const parsed = couponSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "بيانات الكوبون غير صالحة" };
  }

  const { expiresAt, ...data } = parsed.data;

  await prisma.coupon.create({
    data: {
      ...data,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function updateCoupon(id: string, formData: FormData) {
  await guard();

  const raw = {
    code: formData.get("code"),
    type: formData.get("type"),
    value: formData.get("value"),
    expiresAt: formData.get("expiresAt") || null,
    active: formData.get("active") === "true",
  };

  const parsed = couponSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "بيانات الكوبون غير صالحة" };
  }

  const { expiresAt, ...data } = parsed.data;

  await prisma.coupon.update({
    where: { id },
    data: {
      ...data,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function deleteCoupon(id: string) {
  await guard();
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function toggleCouponActive(id: string, active: boolean) {
  await guard();
  await prisma.coupon.update({ where: { id }, data: { active } });
  revalidatePath("/admin/coupons");
  return { success: true };
}
