import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone, Clock } from "lucide-react";
import type { Category, Settings } from "@/lib/types";
import { telHref } from "@/lib/utils";
import { SubscribeForm } from "./Forms";

export default function Footer({ settings, categories }: { settings: Settings; categories: Category[] }) {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-navy-200">
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="relative container-x">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-white/10 py-14 lg:flex-row lg:items-center">
          <div>
            <h3 className="text-2xl font-bold text-white sm:text-3xl">Subscribe to our newsletter</h3>
            <p className="mt-2 text-navy-300">Product launches, industry insights and company updates — straight to your inbox.</p>
          </div>
          <div className="w-full max-w-md"><SubscribeForm /></div>
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3.5">
              <svg viewBox="0 0 100 100" className="h-12 w-12 shrink-0">
                <circle cx="50" cy="50" r="37" fill="none" stroke="#ffffff" strokeWidth="17" />
                <path d="M 63.8 15.7 A 37 37 0 0 1 82.7 32.6" fill="none" stroke="#f5841f" strokeWidth="17.5" />
                <line x1="50" y1="50" x2="68" y2="5" stroke="#0a1426" strokeWidth="2.6" />
                <line x1="50" y1="50" x2="92" y2="27" stroke="#0a1426" strokeWidth="2.6" />
                <circle cx="50" cy="50" r="22.5" fill="none" stroke="#94a3b8" strokeWidth="4.5" />
                <g fill="#0a1426">
                  <circle cx="50" cy="13" r="3.6" /><circle cx="31.5" cy="18" r="3.6" /><circle cx="18" cy="31.5" r="3.6" /><circle cx="13" cy="50" r="3.6" /><circle cx="18" cy="68.5" r="3.6" />
                  <circle cx="31.5" cy="82" r="3.6" /><circle cx="50" cy="87" r="3.6" /><circle cx="68.5" cy="82" r="3.6" /><circle cx="82" cy="68.5" r="3.6" /><circle cx="87" cy="50" r="3.6" />
                </g>
              </svg>
              <div>
                <div className="font-display text-xl font-bold tracking-wider text-white">BLAZETECH</div>
                <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.35em] text-brand-400">
                  <span className="h-px w-4 bg-brand-400" />ENGINEERING<span className="h-px w-4 bg-brand-400" />
                </div>
              </div>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-navy-300">{settings.tagline}. ASME-compliant forged flanges, gaskets, camlock couplings and forged fittings — manufactured in Ahmedabad, supplied worldwide.</p>
            <div className="mt-6 flex gap-3">
              {settings.facebook && <a href={settings.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 transition hover:bg-brand-500"><svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M14 8V6c0-.9.6-1 1-1h3V1h-4c-4 0-5 3-5 5v2H6v4h3v11h5V12h3.5l.5-4h-4z"/></svg></a>}
              {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 transition hover:bg-brand-500"><svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>}
              {settings.linkedin && <a href={settings.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" className="grid h-10 w-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 transition hover:bg-brand-500"><svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9z"/></svg></a>}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-5 text-sm font-semibold tracking-wider text-white uppercase">Company</h4>
            <ul className="space-y-3 text-sm">
              {[["About Us", "/about"], ["Products", "/products"], ["Gallery", "/gallery"], ["Brochure", "/brochure"], ["FAQ", "/faq"], ["Contact", "/contact"]].map(([l, h]) => (
                <li key={h}><Link href={h} className="transition hover:text-brand-400">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-5 text-sm font-semibold tracking-wider text-white uppercase">Product Categories</h4>
            <ul className="space-y-3 text-sm">
              {categories.map((c) => (
                <li key={c.id}><Link href={`/products/category/${c.slug}`} className="group inline-flex items-center gap-1 transition hover:text-brand-400">{c.name}<ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" /></Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-5 text-sm font-semibold tracking-wider text-white uppercase">Get in touch</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /><span>{settings.address}</span></li>
              <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /><span><a href={telHref(settings.phone)} className="hover:text-white">{settings.phone}</a>{settings.phone2 && <><br /><a href={telHref(settings.phone2)} className="hover:text-white">{settings.phone2}</a></>}</span></li>
              <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /><a href={`mailto:${settings.email}`} className="break-all hover:text-white">{settings.email}</a></li>
              <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /><span>{settings.hours}</span></li>
            </ul>
          </div>
        </div>

        {settings.keywords.length > 0 && (
          <div className="border-t border-white/10 py-6">
            <div className="flex flex-wrap gap-2">
              {settings.keywords.map((k) => (
                <Link key={k} href={`/products?q=${encodeURIComponent(k)}`} className="rounded-full border border-white/10 px-3 py-1 text-xs capitalize text-navy-300 transition hover:border-brand-500 hover:text-white">{k}</Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-navy-400 sm:flex-row">
          <p>© {new Date().getFullYear()} {settings.companyName}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link>
            <Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
