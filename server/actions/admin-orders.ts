"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { OrderStatus } from "@prisma/client";

async function guard() {
  const session = await requireAdmin();
  if (!session) throw new Error("غير مصرح");
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await guard();
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function deleteOrder(id: string) {
  await guard();
  await prisma.order.delete({ where: { id } });
  revalidatePath("/admin/orders");
  return { success: true };
}
