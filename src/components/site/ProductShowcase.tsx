"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { excerpt, waHref } from "@/lib/utils";

export default function ProductShowcase({ products, categories, whatsapp = "918320020698" }: { products: Product[]; categories: Category[]; whatsapp?: string }) {
  const [active, setActive] = useState<string>("all");
  const [showAll, setShowAll] = useState(false);
  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c]));

  const filtered = active === "all" ? products : products.filter((p) => p.category === active);
  const items = active === "all" && !showAll ? filtered.slice(0, 8) : filtered;

  return (
    <div>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => { setActive("all"); setShowAll(false); }}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
            active === "all"
              ? "bg-navy-950 text-white shadow-lg shadow-navy-950/20"
              : "bg-white text-navy-900 ring-1 ring-slate-200 hover:bg-navy-50 hover:ring-navy-200"
          }`}
        >
          All Products <span className="ml-1 opacity-70">({products.length})</span>
        </button>
        {categories.map((c) => {
          const n = products.filter((p) => p.category === c.slug).length;
          return (
            <button
              key={c.id}
              onClick={() => setActive(c.slug)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                active === c.slug
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/25"
                  : "bg-white text-navy-900 ring-1 ring-slate-200 hover:bg-navy-50 hover:ring-navy-200"
              }`}
            >
              {c.name} <span className="ml-1 opacity-75">({n})</span>
            </button>
          );
        })}
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((p) => {
          const cat = catMap[p.category];
          return (
            <div
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-[0_24px_50px_-20px_rgb(18,33,59,0.22)]"
            >
              <Link href={`/products/${p.slug}`} className="relative block aspect-[16/10] overflow-hidden border-b border-slate-100 bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.images[0] || "/placeholder.svg"}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full rounded-xl object-contain transition duration-500 group-hover:scale-[1.04]"
                />
                {p.inStock && (
                  <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-green-50/95 px-2 py-0.5 text-[10px] font-bold text-green-700 ring-1 ring-green-200">
                    <BadgeCheck className="h-3 w-3" /> In Stock
                  </span>
                )}
              </Link>
              <div className="flex flex-1 flex-col p-5">
                {cat && (
                  <span className="text-[11px] font-bold tracking-wider text-brand-600 uppercase">
                    {cat.name}
                  </span>
                )}
                <Link href={`/products/${p.slug}`}>
                  <h3 className="mt-1.5 text-base font-bold text-navy-950 transition group-hover:text-brand-600">
                    {p.name}
                  </h3>
                </Link>
                <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-500">
                  {excerpt(p.shortDescription || p.description, 110)}
                </p>
                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3.5">
                  <Link href={`/products/${p.slug}`} className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-navy-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-500">
                    Details <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  <a
                    href={waHref(whatsapp, `Hello Blazetech Engineering, I would like a quote for ${p.name}.`)}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-navy-900 transition hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Message
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        {active === "all" && filtered.length > 8 && (
          <button onClick={() => setShowAll((s) => !s)} className="btn-ghost bg-white">
            {showAll ? (
              <>Show Less <ChevronUp className="h-4 w-4" /></>
            ) : (
              <>Show All {filtered.length} Products <ChevronDown className="h-4 w-4" /></>
            )}
          </button>
        )}
        <Link href="/products" className="btn-primary">
          Explore Full Catalogue <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
