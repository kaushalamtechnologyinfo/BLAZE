"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { GalleryItem } from "@/lib/types";

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [idx, setIdx] = useState<number | null>(null);

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") setIdx((i) => (i === null ? null : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setIdx((i) => (i === null ? null : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, items.length]);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((g, i) => (
          <button
            key={g.id}
            onClick={() => setIdx(i)}
            className="group reveal relative aspect-square overflow-hidden rounded-2xl bg-slate-100 text-left ring-1 ring-slate-200/80 transition hover:-translate-y-1 hover:shadow-xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.image} alt={g.caption || `Gallery photo ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 flex items-center justify-center bg-navy-950/0 transition group-hover:bg-navy-950/40">
              <span className="grid h-12 w-12 scale-75 place-items-center rounded-full bg-white text-navy-950 opacity-0 shadow-lg transition group-hover:scale-100 group-hover:opacity-100">
                <ZoomIn className="h-5 w-5" />
              </span>
            </div>
            {g.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/80 to-transparent p-3 text-xs font-medium text-white">
                {g.caption}
              </div>
            )}
          </button>
        ))}
      </div>

      {idx !== null && (
        <div onClick={() => setIdx(null)} className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/95 p-4 backdrop-blur-sm">
          <button onClick={() => setIdx(null)} className="absolute top-5 right-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx((idx - 1 + items.length) % items.length); }}
            className="absolute left-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[85vh] max-w-5xl text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={items[idx].image} alt={items[idx].caption || ""} className="mx-auto max-h-[78vh] rounded-2xl object-contain" />
            {items[idx].caption && <p className="mt-3 text-sm text-white/80">{items[idx].caption}</p>}
            <p className="mt-1 text-xs text-white/50">{idx + 1} / {items.length}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx((idx + 1) % items.length); }}
            className="absolute right-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
