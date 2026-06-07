"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { updateHeroSlides, uploadHeroImage } from "@/server/actions/admin-settings";
import type { HeroSlide } from "@/types";

export function HeroSlidesManager({ initialSlides }: { initialSlides: HeroSlide[] }) {
  const router = useRouter();
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setLoading(true);
    const result = await updateHeroSlides(JSON.stringify(slides));
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? "فشل الحفظ");
      return;
    }
    setError("");
    router.refresh();
  };

  const addSlide = () => {
    setSlides([
      ...slides,
      {
        id: `slide-${Date.now()}`,
        title: "عنوان جديد",
        titleEn: "New Title",
        subtitle: "",
        subtitleEn: "",
        image: "/uploads/placeholder.svg",
        ctaText: "تسوق الآن",
        ctaLink: "/products",
        active: true,
      },
    ]);
  };

  const uploadImage = async (slideId: string, file: File) => {
    const fd = new FormData();
    fd.append("image", file);
    const result = await uploadHeroImage(fd);
    if (result.success && result.url) {
      setSlides((s) =>
        s.map((slide) =>
          slide.id === slideId ? { ...slide, image: result.url! } : slide
        )
      );
    }
  };

  return (
    <Card className="max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-lg">شرائح الهيرو</h2>
        <Button variant="outline" size="sm" onClick={addSlide}>
          + إضافة شريحة
        </Button>
      </div>

      <div className="space-y-6">
        {slides.map((slide, index) => (
          <div key={slide.id} className="border border-beige rounded-luxury p-4 space-y-3">
            <div className="flex gap-4">
              <div className="relative h-24 w-40 rounded-luxury overflow-hidden bg-beige flex-shrink-0">
                <Image src={slide.image} alt="" fill className="object-cover" />
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  label="العنوان (عربي)"
                  value={slide.title}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSlides((s) => {
                      const n = [...s];
                      n[index] = { ...n[index], title: v };
                      return n;
                    });
                  }}
                />
                <Input
                  label="العنوان (إنجليزي)"
                  value={slide.titleEn}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSlides((s) => {
                      const n = [...s];
                      n[index] = { ...n[index], titleEn: v };
                      return n;
                    });
                  }}
                />
              </div>
            </div>
            <Input
              label="العنوان الفرعي (عربي)"
              value={slide.subtitle ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setSlides((s) => {
                  const n = [...s];
                  n[index] = { ...n[index], subtitle: v };
                  return n;
                });
              }}
            />
            <div className="flex gap-4">
              <Input
                label="نص الزر"
                value={slide.ctaText ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setSlides((s) => {
                    const n = [...s];
                    n[index] = { ...n[index], ctaText: v };
                    return n;
                  });
                }}
              />
              <Input
                label="رابط الزر"
                value={slide.ctaLink ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setSlides((s) => {
                    const n = [...s];
                    n[index] = { ...n[index], ctaLink: v };
                    return n;
                  });
                }}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={slide.active}
                  onChange={(e) => {
                    const v = e.target.checked;
                    setSlides((s) => {
                      const n = [...s];
                      n[index] = { ...n[index], active: v };
                      return n;
                    });
                  }}
                />
                نشط
              </label>
              <input
                type="file"
                accept="image/*"
                className="text-sm"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(slide.id, file);
                }}
              />
              <button
                type="button"
                className="text-sm text-red-500 mr-auto"
                onClick={() => setSlides((s) => s.filter((_, i) => i !== index))}
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      <Button className="mt-6" variant="accent" onClick={save} loading={loading}>
        حفظ الشرائح
      </Button>
    </Card>
  );
}
