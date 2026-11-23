import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Calendar, ChevronRight, MessageCircle } from "lucide-react";
import type { Category, Post, Product } from "@/lib/types";
import { excerpt, formatDate, waHref } from "@/lib/utils";

export function ProductCard({ p, category, whatsapp = "918320020698" }: { p: Product; category?: Category; whatsapp?: string }) {
  return (
    <div className="group reveal flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-[0_24px_50px_-20px_rgb(18,33,59,0.22)]">
      <Link href={`/products/${p.slug}`} className="relative block aspect-[16/10] overflow-hidden border-b border-slate-100 bg-white p-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.images[0] || "/placeholder.svg"} alt={p.name} loading="lazy" className="h-full w-full rounded-xl object-contain transition duration-500 group-hover:scale-[1.04]" />
        {p.inStock && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-green-50/95 px-2.5 py-1 text-[10px] font-bold text-green-700 ring-1 ring-green-200 backdrop-blur">
            <BadgeCheck className="h-3 w-3" /> In Stock
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {category && <span className="text-[11px] font-bold tracking-wider text-brand-600 uppercase">{category.name}</span>}
        <Link href={`/products/${p.slug}`}>
          <h3 className="mt-1.5 text-lg font-bold text-navy-950 transition group-hover:text-brand-600">{p.name}</h3>
        </Link>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">{excerpt(p.shortDescription || p.description, 130)}</p>
        <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
          <Link href={`/products/${p.slug}`} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-navy-950 px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-500">
            View Details <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <a
            href={waHref(whatsapp, `Hello Blazetech Engineering, I would like a quote for ${p.name}.`)}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-navy-900 transition hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
            title="Send Message on WhatsApp"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Message
          </a>
        </div>
      </div>
    </div>
  );
}

export function PostCard({ p }: { p: Post }) {
  return (
    <Link href={`/updates/${p.slug}`} className="group reveal flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgb(10,20,38,0.3)] hover:ring-transparent">
      <div className="aspect-[16/9] overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {p.image && <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-xs font-medium text-brand-600"><Calendar className="h-3.5 w-3.5" /> {formatDate(p.date)}</div>
        <h3 className="mt-3 line-clamp-2 text-lg leading-snug font-semibold text-navy-950 group-hover:text-brand-600">{p.title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-500">{excerpt(p.content.split("\n").slice(1).join(" ") || p.content, 140)}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-900">Read more <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
      </div>
    </Link>
  );
}

export function SectionHead({ eyebrow, title, desc, center = false, light = false }: { eyebrow: string; title: React.ReactNode; desc?: string; center?: boolean; light?: boolean }) {
  return (
    <div className={`reveal ${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      <span className={`eyebrow ${center ? "justify-center" : ""}`}>{eyebrow}</span>
      <h2 className={`mt-4 text-3xl leading-tight font-bold sm:text-4xl lg:text-[2.75rem] ${light ? "text-white" : "text-navy-950"}`}>{title}</h2>
      {desc && <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? "text-navy-200" : "text-slate-500"}`}>{desc}</p>}
    </div>
  );
}

export function PageHero({ title, desc, crumbs, image }: { title: string; desc?: string; crumbs: { label: string; href?: string }[]; image?: string }) {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/60" />
      <div className="grid-bg absolute inset-0" />
      <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl" />
      <FlangeArt className="absolute top-1/2 -right-24 hidden h-[420px] w-[420px] -translate-y-1/2 animate-spin-slow text-white/[0.06] lg:block" />
      <div className="relative container-x py-16 sm:py-24">
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-navy-300">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
              {c.href ? <Link href={c.href} className="hover:text-white">{c.label}</Link> : <span className="text-brand-400">{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1 className="mt-5 max-w-4xl text-3xl leading-tight font-bold text-white sm:text-5xl">{title}</h1>
        {desc && <p className="mt-5 max-w-2xl text-lg text-navy-200">{desc}</p>}
      </div>
    </section>
  );
}

/** Decorative flange line-art used across the site. */
export function FlangeArt({ className = "" }: { className?: string }) {
  const holes = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return { x: 100 + Math.cos(a) * 74, y: 100 + Math.sin(a) * 74 };
  });
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="100" cy="100" r="96" />
      <circle cx="100" cy="100" r="88" />
      <circle cx="100" cy="100" r="58" />
      <circle cx="100" cy="100" r="40" />
      <circle cx="100" cy="100" r="34" />
      {holes.map((h, i) => <circle key={i} cx={h.x} cy={h.y} r="7" />)}
    </svg>
  );
}
