"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Mail, Menu, Phone, X, Clock, ArrowRight, MapPin } from "lucide-react";
import type { Category, Page, Settings } from "@/lib/types";
import { cn, telHref } from "@/lib/utils";

type Props = { settings: Settings; categories: Category[]; pages: Pick<Page, "slug" | "title">[] };

export default function Header({ settings, categories, pages }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const nav = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/products", label: "Products", mega: true },
    { href: "/gallery", label: "Gallery" },
    { href: "/brochure", label: "Brochure" },
    { href: "/faq", label: "FAQ", more: true },
    { href: "/contact", label: "Contact" },
  ];
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));

  return (
    <>
      {/* top bar */}
      <div className="hidden bg-navy-950 text-[13px] text-navy-200 lg:block">
        <div className="container-x flex h-10 items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-brand-400" /> Vatva, Ahmedabad, Gujarat, India</span>
            <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-brand-400" /> {settings.hours}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-white"><Mail className="h-3.5 w-3.5 text-brand-400" /> {settings.email}</a>
            <a href={telHref(settings.phone)} className="flex items-center gap-2 hover:text-white"><Phone className="h-3.5 w-3.5 text-brand-400" /> {settings.phone}</a>
          </div>
        </div>
      </div>

      <header className={cn("sticky top-0 z-50 transition-all duration-300", scrolled ? "bg-white/90 shadow-[0_8px_30px_rgb(10,20,38,0.08)] backdrop-blur-xl" : "bg-white")}>
        <div className={cn("container-x flex items-center justify-between transition-all", scrolled ? "h-16" : "h-20")}>
          <Link href="/" className="shrink-0" aria-label={settings.companyName}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={settings.logo} alt={settings.companyName} className={cn("w-auto mix-blend-multiply transition-all", scrolled ? "h-10" : "h-12")} />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((n) =>
              n.mega ? (
                <div key={n.href} className="group relative">
                  <Link href={n.href} className={cn("flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition", active(n.href) ? "text-brand-600" : "text-navy-900 hover:text-brand-600")}>
                    {n.label} <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
                  </Link>
                  <div className="invisible absolute top-full left-1/2 w-[640px] -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-100 bg-white p-3 shadow-2xl shadow-navy-950/10">
                      {categories.map((c) => (
                        <Link key={c.id} href={`/products/category/${c.slug}`} className="group/i flex items-center gap-3 rounded-xl p-3 transition hover:bg-navy-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={c.image} alt="" className="h-14 w-20 shrink-0 rounded-lg border border-slate-100 bg-white object-contain p-1" />
                          <div>
                            <div className="text-sm font-semibold text-navy-900 group-hover/i:text-brand-600">{c.name}</div>
                            <div className="line-clamp-1 text-xs text-slate-500">{c.description}</div>
                          </div>
                        </Link>
                      ))}
                      <Link href="/products" className="col-span-2 flex items-center justify-between rounded-xl bg-navy-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-navy-900">
                        View all products <ArrowRight className="h-4 w-4 text-brand-400" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : n.more ? (
                <div key={n.href} className="group relative">
                  <button className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-navy-900 transition hover:text-brand-600">
                    More <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
                  </button>
                  <div className="invisible absolute top-full right-0 w-80 translate-y-2 pt-3 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl shadow-navy-950/10">
                      {pages.map((p) => (
                        <Link key={p.slug} href={`/pages/${p.slug}`} className="block rounded-lg px-4 py-2.5 text-sm text-navy-900 hover:bg-navy-50 hover:text-brand-600">{p.title}</Link>
                      ))}
                      <Link href="/faq" className="block rounded-lg px-4 py-2.5 text-sm text-navy-900 hover:bg-navy-50 hover:text-brand-600">FAQ</Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={n.href} href={n.href} className={cn("rounded-full px-4 py-2 text-sm font-medium transition", active(n.href) ? "text-brand-600" : "text-navy-900 hover:text-brand-600")}>
                  {n.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/contact#quote" className="btn-primary hidden sm:inline-flex">Get a Quote <ArrowRight className="h-4 w-4" /></Link>
            <button onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center rounded-full bg-navy-950 text-white lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* mobile drawer */}
      <div className={cn("fixed inset-0 z-[60] lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")}>
        <div onClick={() => setOpen(false)} className={cn("absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity", open ? "opacity-100" : "opacity-0")} />
        <aside className={cn("absolute top-0 right-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-500", open ? "translate-x-0" : "translate-x-full")}>
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={settings.logo} alt="" className="h-10 mix-blend-multiply" />
            <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100" aria-label="Close menu"><X className="h-5 w-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            {nav.filter((n) => !n.more).map((n) => (
              <div key={n.href}>
                <Link href={n.href} className={cn("block border-b border-slate-100 py-3.5 font-display font-semibold", active(n.href) ? "text-brand-600" : "text-navy-900")}>{n.label}</Link>
                {n.mega && (
                  <div className="grid gap-1 py-2 pl-3">
                    {categories.map((c) => (
                      <Link key={c.id} href={`/products/category/${c.slug}`} className="py-1.5 text-sm text-slate-600">{c.name}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-2 grid gap-1">
              <Link href="/faq" className="py-2 text-sm text-slate-600">FAQ</Link>
              {pages.map((p) => <Link key={p.slug} href={`/pages/${p.slug}`} className="py-2 text-sm text-slate-600">{p.title}</Link>)}
            </div>
          </div>
          <div className="space-y-3 border-t border-slate-100 p-5">
            <Link href="/contact#quote" className="btn-primary w-full">Get a Free Quote</Link>
            <a href={telHref(settings.phone)} className="btn-ghost w-full"><Phone className="h-4 w-4" /> {settings.phone}</a>
          </div>
        </aside>
      </div>
    </>
  );
}
