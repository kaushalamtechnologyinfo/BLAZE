import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, Cog, Globe2, Hammer, Microscope, ShieldCheck, Truck } from "lucide-react";
import { getData } from "@/lib/db";
import { PageHero, SectionHead } from "@/components/site/Cards";

export const metadata: Metadata = {
  title: "About Us",
  description: "BlazeTech Engineering is a manufacturing-focused engineering company in Ahmedabad specializing in industrial flanges, forged fittings, camlock couplings and gaskets.",
};

export default async function AboutPage() {
  const d = await getData();
  const s = d.settings;
  return (
    <>
      <PageHero
        title={s.tagline}
        desc="Manufacturing excellence, technical accuracy and dependable delivery from Ahmedabad to process industries worldwide."
        crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        image={s.aboutImage}
      />

      <section className="py-20">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div className="reveal">
            <SectionHead eyebrow="Who we are" title="Engineering reliability into every flange &amp; seal" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
              {s.aboutContent.split(/\n\s*\n/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-8 space-y-3">
              <div className="text-xs font-bold tracking-wider text-navy-900 uppercase">What We Manufacture</div>
              {s.manufactures.map((m) => (
                <div key={m} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 font-medium text-navy-900">
                  <BadgeCheck className="h-5 w-5 shrink-0 text-brand-500" /> {m}
                </div>
              ))}
            </div>
          </div>
          <div className="reveal relative">
            <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.aboutImage} alt={s.companyName} className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {s.stats.map((st) => (
                <div key={st.label} className="rounded-2xl bg-navy-950 p-5 text-center text-white">
                  <div className="font-display text-2xl font-bold text-brand-400">{st.value}</div>
                  <div className="mt-1 text-[11px] text-navy-200 uppercase">{st.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container-x">
          <SectionHead center eyebrow="Our strengths" title="Built for demanding piping systems" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { i: Hammer, t: "Controlled Forging", d: "Carefully controlled forging processes for superior grain structure and mechanical integrity." },
              { i: Cog, t: "Precision CNC Machining", d: "Tight dimensional tolerances, smooth gasket seating faces and accurate bolt-hole alignment." },
              { i: Microscope, t: "Strict Quality Assurance", d: "Every batch undergoes material verification, dimensional checks and visual inspection." },
              { i: ShieldCheck, t: "ASME / ANSI / SAE / DIN", d: "Full compliance with international piping standards and customer-specific drawings." },
              { i: Globe2, t: "Domestic & Export Supply", d: "Serving EPC contractors and OEMs across India, UAE, Middle East and global markets." },
              { i: Truck, t: "Dependable Delivery", d: "Ready stock of standard sizes paired with fast turnaround for custom specifications." },
            ].map(({ i: I, t, d: desc }) => (
              <div key={t} className="reveal rounded-2xl bg-white p-7 ring-1 ring-slate-200/80">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600"><I className="h-6 w-6" /></div>
                <h3 className="mt-5 text-lg font-semibold text-navy-950">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/contact#quote" className="btn-primary">Request a Quote <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
