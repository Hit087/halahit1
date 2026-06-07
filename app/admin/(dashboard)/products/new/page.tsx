import { prisma } from "@/lib/prisma";
import { ProductForm } from "../ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">إضافة منتج</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
