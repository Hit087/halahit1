import { PrismaClient, CouponType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const heroSlides = [
  {
    id: "slide-1",
    title: "حلويات فاخرة",
    titleEn: "Luxury Desserts",
    subtitle: "لكل قطعة ذكرى",
    subtitleEn: "Every piece, a memory",
    image: "/uploads/placeholder.svg",
    ctaText: "تسوق الآن",
    ctaLink: "/products",
    active: true,
  },
  {
    id: "slide-2",
    title: "تشكيلة موسمية",
    titleEn: "Seasonal Collection",
    subtitle: "نكهات تأسر الحواس",
    subtitleEn: "Flavors that captivate",
    image: "/uploads/placeholder.svg",
    ctaText: "اكتشف المزيد",
    ctaLink: "/products",
    active: true,
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "hithytl15@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "HitAdmin2024!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Hit Admin",
    },
  });

  await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      storeName: "Hit | هيت",
      tagline: "لكل قطعة ذكرى",
      whatsappNumber: "966500000000",
      logo: "/uploads/placeholder.svg",
      mapLink: "https://maps.google.com",
      jahezLink: "https://jahez.net",
      hungerStationLink: "https://hungerstation.com",
      toYouLink: "https://toyou.io",
      heroSlides,
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "cakes" },
      update: {},
      create: {
        name: "كيك",
        nameEn: "Cakes",
        slug: "cakes",
        image: "/uploads/placeholder.svg",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "chocolates" },
      update: {},
      create: {
        name: "شوكولاتة",
        nameEn: "Chocolates",
        slug: "chocolates",
        image: "/uploads/placeholder.svg",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "boxes" },
      update: {},
      create: {
        name: "بوكسات هدايا",
        nameEn: "Gift Boxes",
        slug: "boxes",
        image: "/uploads/placeholder.svg",
        sortOrder: 3,
      },
    }),
  ]);

  const productsData = [
    {
      name: "كيكة الورد الفاخرة",
      nameEn: "Luxury Rose Cake",
      description: "كيكة فانيلا طرية مغطاة بكريمة الزبدة الوردية وزينة الذهب الصالحة للأكل.",
      descriptionEn: "Soft vanilla cake with rose buttercream and edible gold accents.",
      price: 189,
      featured: true,
      categoryId: categories[0].id,
      images: ["/uploads/placeholder.svg"],
    },
    {
      name: "ترافل الشوكولاتة البلجيكية",
      nameEn: "Belgian Chocolate Truffles",
      description: "صندوق من 12 قطعة ترافل غنية بالكاكاو البلجيكي 72%.",
      descriptionEn: "Box of 12 rich 72% Belgian cocoa truffles.",
      price: 95,
      featured: true,
      categoryId: categories[1].id,
      images: ["/uploads/placeholder.svg"],
    },
    {
      name: "بوكس هيت الملكي",
      nameEn: "Hit Royal Gift Box",
      description: "تشكيلة مختارة من أفضل حلويات هيت في علبة فاخرة.",
      descriptionEn: "Curated selection of Hit's finest desserts in a premium box.",
      price: 320,
      featured: true,
      categoryId: categories[2].id,
      images: ["/uploads/placeholder.svg", "/uploads/placeholder.svg"],
    },
    {
      name: "ماكارون فرنسي",
      nameEn: "French Macarons",
      description: "ماكارون بستاشيو وتوت وفانيلا — 9 قطع.",
      descriptionEn: "Pistachio, berry, and vanilla macarons — 9 pieces.",
      price: 75,
      featured: false,
      categoryId: categories[1].id,
      images: ["/uploads/placeholder.svg"],
    },
  ];

  for (const p of productsData) {
    const existing = await prisma.product.findFirst({
      where: { name: p.name },
    });
    if (existing) continue;

    const { images, ...productFields } = p;
    await prisma.product.create({
      data: {
        ...productFields,
        images: {
          create: images.map((url, i) => ({ url, sortOrder: i })),
        },
      },
    });
  }

  await prisma.coupon.upsert({
    where: { code: "HIT10" },
    update: {},
    create: {
      code: "HIT10",
      type: CouponType.PERCENTAGE,
      value: 10,
      active: true,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.coupon.upsert({
    where: { code: "WELCOME50" },
    update: {},
    create: {
      code: "WELCOME50",
      type: CouponType.FIXED,
      value: 50,
      active: true,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("Seed completed.");
  console.log(`Admin login: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
