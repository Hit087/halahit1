import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { CategoryForm } from "./CategoryForm";
import { DeleteCategoryButton } from "./DeleteCategoryButton";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">التصنيفات</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold mb-4">إضافة تصنيف</h2>
          <CategoryForm />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">التصنيفات الحالية</h2>
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-luxury-lg bg-white p-4 shadow-soft flex gap-4 items-start"
            >
              {cat.image && (
                <div className="relative h-16 w-16 rounded-luxury overflow-hidden flex-shrink-0">
                  <Image src={cat.image} alt="" fill className="object-cover" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{cat.name}</p>
                  <Badge variant={cat.active ? "success" : "muted"}>
                    {cat.active ? "نشط" : "معطّل"}
                  </Badge>
                </div>
                <p className="text-sm text-text/60">{cat.slug} · {cat._count.products} منتج</p>
                <CategoryForm category={cat} compact />
                <DeleteCategoryButton id={cat.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
