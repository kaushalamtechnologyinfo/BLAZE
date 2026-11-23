import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone, Tag } from "lucide-react";
import type { Settings } from "@/lib/types";
import { telHref, waHref } from "@/lib/utils";

export function SubcategoryTags({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <section className="border-t border-slate-100 bg-white py-14">
      <div className="container-x">
        <div className="flex items-center gap-2.5">
          <Tag className="h-4 w-4 text-brand-500" />
          <h2 className="font-display text-lg font-bold text-navy-950">Subcategory Tags</h2>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((t) => {
            const q = t.toLowerCase().includes("sae")
              ? "sae"
              : t.toLowerCase().includes("flat face")
                ? "flat face"
                : t.toLowerCase().includes("slip-on")
                  ? "slip on"
                  : t;
            return (
              <Link
                key={t}
                href={`/products?q=${encodeURIComponent(q)}`}
                className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-navy-900 transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600"
              >
                {t}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ContactStrip({ settings: s }: { settings: Settings }) {
  return (
    <section className="border-t border-slate-200/80 bg-slate-50 py-16">
      <div className="container-x">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow">Need Assistance?</span>
            <h2 className="mt-2 text-2xl font-bold text-navy-950 sm:text-3xl">Contact Blazetech Engineering</h2>
          </div>
          <a
            href={waHref(s.whatsapp)}
            target="_blank"
            rel="noopener"
            className="btn w-fit bg-[#25D366] text-white shadow-lg shadow-green-600/20 hover:-translate-y-0.5 hover:bg-[#1fb857]"
          >
            <MessageCircle className="h-4 w-4" /> Live WhatsApp Chat
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a href={telHref(s.phone)} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600"><Phone className="h-5 w-5" /></div>
            <div className="mt-3 text-xs font-bold tracking-wider text-slate-400 uppercase">Phone Number</div>
            <div className="mt-1 font-display font-bold text-navy-950">{s.phone}</div>
            <div className="mt-0.5 text-[11px] text-slate-400">Please keep 0 before dialling.</div>
          </a>

          <a href={`mailto:${s.email}`} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600"><Mail className="h-5 w-5" /></div>
            <div className="mt-3 text-xs font-bold tracking-wider text-slate-400 uppercase">Email Address</div>
            <div className="mt-1 break-all text-sm font-bold text-navy-950">{s.email}</div>
            <div className="mt-0.5 text-[11px] text-slate-400">24-hour quotation response</div>
          </a>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600"><Clock className="h-5 w-5" /></div>
            <div className="mt-3 text-xs font-bold tracking-wider text-slate-400 uppercase">Working Hours</div>
            <div className="mt-1 text-sm font-semibold text-navy-950">{s.hours}</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600"><MapPin className="h-5 w-5" /></div>
            <div className="mt-3 text-xs font-bold tracking-wider text-slate-400 uppercase">Address</div>
            <div className="mt-1 text-xs leading-relaxed font-medium text-slate-600">{s.address}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
