import { ProductCard } from "@/components/products/ProductCard";
import { getProducts, getActiveCategories } from "@/server/queries";
import Link from "next/link";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const [products, categories] = await Promise.all([
    getProducts({
      categorySlug: searchParams.category,
      search: searchParams.q,
    }),
    getActiveCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-text">المنتجات</h1>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/products"
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            !searchParams.category
              ? "bg-accent text-white"
              : "bg-beige text-text hover:bg-primary"
          }`}
        >
          الكل
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              searchParams.category === cat.slug
                ? "bg-accent text-white"
                : "bg-beige text-text hover:bg-primary"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <p className="mt-16 text-center text-text/50">لا توجد منتجات</p>
      )}
    </div>
  );
}
