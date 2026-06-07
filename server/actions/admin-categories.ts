"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";
import { saveUploadedFile } from "@/server/upload";

async function guard() {
  const session = await requireAdmin();
  if (!session) throw new Error("غير مصرح");
}

export async function createCategory(formData: FormData) {
  await guard();

  const imageFile = formData.get("image");
  let image: string | undefined;

  if (imageFile instanceof File && imageFile.size > 0) {
    image = await saveUploadedFile(imageFile);
  }

  const raw = {
    name: formData.get("name"),
    nameEn: formData.get("nameEn"),
    slug: formData.get("slug"),
    image,
    active: formData.getAll("active").includes("true"),
    sortOrder: formData.get("sortOrder") ?? 0,
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "بيانات التصنيف غير صالحة" };
  }

  await prisma.category.create({ data: { ...parsed.data, id: crypto.randomUUID() } });
  revalidatePath("/");
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  await guard();

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return { success: false, error: "التصنيف غير موجود" };

  const imageFile = formData.get("image");
  let image = existing.image ?? undefined;

  if (imageFile instanceof File && imageFile.size > 0) {
    image = await saveUploadedFile(imageFile);
  } else if (formData.get("clearImage") === "true") {
    image = undefined;
  }

  const raw = {
    name: formData.get("name"),
    nameEn: formData.get("nameEn"),
    slug: formData.get("slug"),
    image,
    active: formData.getAll("active").includes("true"),
    sortOrder: formData.get("sortOrder") ?? 0,
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "بيانات التصنيف غير صالحة" };
  }

  await prisma.category.update({ where: { id }, data: parsed.data });
  revalidatePath("/");
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await guard();

  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return { success: false, error: "لا يمكن حذف تصنيف يحتوي على منتجات" };
  }

  await prisma.category.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/categories");
  return { success: true };
}