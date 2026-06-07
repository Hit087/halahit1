"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function ProductGallery({ images }: { images: { url: string }[] }) {
  const [active, setActive] = useState(0);
  const urls = images.length > 0 ? images.map((i) => i.url) : ["/uploads/placeholder.svg"];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-luxury-lg bg-beige/30 shadow-soft">
        <AnimatePresence mode="wait">
          <motion.div
            key={urls[active]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <Image
              src={urls[active]}
              alt="Product"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {urls.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {urls.map((url, i) => (
            <button
              key={url + i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-luxury border-2 transition ${
                i === active ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={url} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
