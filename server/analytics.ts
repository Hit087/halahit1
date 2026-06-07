import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function trackEvent(
  type: string,
  path?: string,
  productId?: string,
  metadata?: Prisma.InputJsonValue
) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        type,
        path,
        productId,
        metadata,
      },
    });
  } catch {
    // Non-blocking analytics
  }
}

export async function getAnalyticsSummary() {
  const [visits, orders, productViews] = await Promise.all([
    prisma.analyticsEvent.count({ where: { type: "PAGE_VIEW" } }),
    prisma.order.count(),
    prisma.analyticsEvent.groupBy({
      by: ["productId"],
      where: { type: "PRODUCT_VIEW", productId: { not: null } },
      _count: { productId: true },
      orderBy: { _count: { productId: "desc" } },
      take: 5,
    }),
  ]);

  const popularProductIds = productViews
    .map((p) => p.productId)
    .filter((id): id is string => !!id);

  const popularProducts =
    popularProductIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: popularProductIds } },
          include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
        })
      : [];

  const orderedPopular = popularProductIds
    .map((id) => popularProducts.find((p) => p.id === id))
    .filter(Boolean);

  return {
    totalVisits: visits,
    totalOrders: orders,
    popularProducts: orderedPopular,
    productViewCounts: productViews,
  };
}
