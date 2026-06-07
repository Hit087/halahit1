"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import type { HeroSlide } from "@/types";
import { useLocaleStore } from "@/store/locale-store";
import { localizedName } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";

export function HeroCarousel({
  slides,
}: {
  slides: HeroSlide[];
}) {
  const activeSlides = slides.filter((s) => s.active);

  const [index, setIndex] = useState(0);

  const locale = useLocaleStore((s) => s.locale);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % activeSlides.length);
  }, [activeSlides.length]);

  useEffect(() => {
    if (activeSlides.length <= 1) return;

    const timer = setInterval(next, 6000);

    return () => clearInterval(timer);
  }, [activeSlides.length, next]);

  if (!activeSlides.length) return null;

  const slide = activeSlides[index];

  return (
    <div className="mx-auto my-6 max-w-7xl px-4 sm:px-6">
      <section
        className="
          relative
          overflow-hidden
          rounded-[36px]
          border
          border-[#f1e4df]
          bg-gradient-to-r
          from-[#fcf7f5]
          via-[#faf2ef]
          to-[#f7ebe6]
          shadow-[0_20px_60px_rgba(0,0,0,0.08)]
        "
      >
        {/* زخارف جانبية */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
          <svg
            className="absolute left-0 top-0 h-full w-52"
            viewBox="0 0 200 300"
            fill="none"
          >
            <path
              d="M30,20 Q80,80 30,140 Q-20,200 30,260"
              stroke="#ead1c8"
              strokeWidth="5"
            />
            <path
              d="M80,0 Q130,60 80,120 Q30,180 80,240"
              stroke="#ead1c8"
              strokeWidth="5"
            />
          </svg>

          <svg
            className="absolute right-0 top-0 h-full w-52 scale-x-[-1]"
            viewBox="0 0 200 300"
            fill="none"
          >
            <path
              d="M30,20 Q80,80 30,140 Q-20,200 30,260"
              stroke="#ead1c8"
              strokeWidth="5"
            />
            <path
              d="M80,0 Q130,60 80,120 Q30,180 80,240"
              stroke="#ead1c8"
              strokeWidth="5"
            />
          </svg>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="
              grid
              items-center
              gap-4
              md:grid-cols-[38%_62%]
            "
          >
            {/* النص */}
            <div className="relative z-20 px-8 py-10 md:px-12">
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h1
                  className="
                    font-display
                    text-3xl
                    font-bold
                    leading-relaxed
                    text-[#5b4033]
                    md:text-5xl
                  "
                >
                  {localizedName(
                    slide.title,
                    slide.titleEn,
                    locale
                  )}
                </h1>

                {(slide.subtitle || slide.subtitleEn) && (
                  <p
                    className="
                      mt-4
                      max-w-md
                      text-base
                      leading-7
                      text-[#7b665b]
                      md:text-lg
                    "
                  >
                    {localizedName(
                      slide.subtitle ?? "",
                      slide.subtitleEn ?? "",
                      locale
                    )}
                  </p>
                )}

                {slide.ctaLink && (
                  <Link
                    href={slide.ctaLink}
                    className="mt-8 inline-block"
                  >
                    <Button
                      size="lg"
                      className="
                        rounded-xl
                        bg-[#e3aeba]
                        px-8
                        text-white
                        hover:bg-[#d89daa]
                      "
                    >
                      {slide.ctaText ?? "تسوق الآن"}
                    </Button>
                  </Link>
                )}
              </motion.div>
            </div>

            {/* الصورة */}
            <div className="relative p-5 md:p-7">
              <div
                className="
                  relative
                  h-[280px]
                  md:h-[420px]
                  overflow-hidden
                  rounded-[28px]
                  bg-transparent
                "
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority
                  sizes="60vw"
                  className="
                    object-cover
                    object-center
                  "
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* النقاط */}
        {activeSlides.length > 1 && (
          <div className="flex justify-center gap-2 pb-5">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-8 bg-[#d8a5b1]"
                    : "w-2 bg-[#d8a5b1]/30"
                }`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}