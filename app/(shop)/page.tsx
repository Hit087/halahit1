import Link from "next/link";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductCard } from "@/components/products/ProductCard";
import {
  getSettings,
  parseHeroSlides,
  getFeaturedProducts,
  getCategoriesWithProducts,
} from "@/server/queries";

export default async function HomePage() {
  const [settings, featured, categoriesWithProducts] = await Promise.all([
    getSettings(),
    getFeaturedProducts(6),
    getCategoriesWithProducts(),
  ]);

  const heroSlides = parseHeroSlides(settings?.heroSlides);

  return (
    <>
      <HeroCarousel slides={heroSlides} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-text md:text-4xl">
              منتجات مميزة
            </h2>
            <p className="mt-2 text-text/60">تشكيلة مختارة بعناية</p>
          </div>
          <Link
            href="/products"
            className="text-accent transition hover:underline"
          >
            عرض الكل ←
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {featured.length === 0 && (
          <p className="text-center text-text/50">لا توجد منتجات مميزة حالياً</p>
        )}
      </section>

      {categoriesWithProducts.map((category) => (
        <section key={category.id} className="bg-white/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl font-bold text-text md:text-4xl">
                  {category.name}
                </h2>
                <p className="mt-2 text-text/60">{category.nameEn}</p>
              </div>
              <Link
                href={`/products?category=${category.slug}`}
                className="text-accent transition hover:underline"
              >
                عرض الكل ←
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {category.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
        <p className="font-display text-2xl text-text/80 md:text-3xl">
          {settings?.tagline ?? "لكل قطعة ذكرى"}
        </p>
      </section>
    </>
  );
}
