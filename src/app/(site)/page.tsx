import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, BadgeCheck, Cog, Factory, Flame, Globe2, Hammer, Microscope, PackageCheck, Ruler, ShieldCheck, Truck,
  Droplets, Zap, FlaskConical, Ship, Gauge, Building2, Fuel, Plus, Phone, Download, Award, Layers,
} from "lucide-react";
import { getData } from "@/lib/db";
import { SectionHead, FlangeArt } from "@/components/site/Cards";
import ProductShowcase from "@/components/site/ProductShowcase";
import HeroVideo from "@/components/site/HeroVideo";
import { telHref } from "@/lib/utils";

export default async function Home() {
  const d = await getData();
  const s = d.settings;
  const cats = [...d.categories].sort((a, b) => a.order - b.order);
  const allProducts = [...d.products].sort((a, b) => a.order - b.order);
  const count = (slug: string) => d.products.filter((p) => p.category === slug).length;

  const marquee = [
    "Weld Neck Flanges", "Slip-On Flanges", "Blind Flanges", "SAE Flanges", "Socket Weld Flanges",
    "PTFE Gaskets", "Camlock Couplings", "Forged Fittings", "ASME B16.5", "Threaded Flanges",
    "Reducing Flanges", "Metallic Gaskets",
  ];

  const aboutPhoto1 = d.gallery[0]?.image || s.aboutImage;
  const aboutPhoto2 = d.gallery[1]?.image || s.aboutImage;

  return (
    <>
      {/* HERO — FULL BANNER VIDEO */}
      <section className="relative flex min-h-[82vh] items-center overflow-hidden bg-navy-950">
        {s.heroVideo ? (
          <HeroVideo src={s.heroVideo} poster={s.aboutImage} />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.aboutImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-navy-950/40" />
          </>
        )}

        <div className="relative z-10 container-x py-20 lg:py-28">
          <div className="max-w-2xl">
            <div className="reveal inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-navy-950/50 py-1.5 pr-4 pl-1.5 text-xs font-medium text-white backdrop-blur-md">
              <span className="rounded-full bg-brand-500 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">ASME · ISO</span>
              Manufacturer &amp; Global Exporter · Ahmedabad
            </div>

            <h1 className="reveal mt-6 text-4xl leading-[1.06] font-bold tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl">
              Precision-Forged{" "}
              <span className="relative inline-block text-brand-400">
                Flanges
                <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 9c40-6 120-8 196-3" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </span>
              , Fittings &amp; Sealing Solutions
            </h1>

            <p className="reveal mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
              {s.heroSubtitle}
            </p>

            <div className="reveal mt-9 flex flex-wrap gap-3.5">
              <Link href="/products" className="btn-primary !px-7 !py-4">
                Explore Products <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact#quote" className="btn-outline bg-navy-950/35 !px-7 !py-4">
                Get a Free Quote
              </Link>
              {s.brochure && (
                <a href={s.brochure} target="_blank" rel="noopener" className="btn border border-white/25 bg-navy-950/40 !px-5 !py-4 text-white backdrop-blur-md hover:bg-white/15">
                  <Download className="h-4 w-4 text-brand-400" /> Brochure
                </a>
              )}
            </div>

            <div className="reveal mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/20 pt-7 text-xs font-medium text-white/90 sm:text-sm">
              {[
                { i: ShieldCheck, t: "ASME B16.5 / B16.47" },
                { i: Ruler, t: "CNC Precision Machined" },
                { i: Globe2, t: "Domestic & Export" },
              ].map(({ i: I, t }) => (
                <span key={t} className="flex items-center gap-2">
                  <I className="h-4 w-4 text-brand-400" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-brand-600/30 bg-brand-500 py-3.5 text-white">
        <div className="flex w-max animate-marquee gap-10 font-display text-xs font-semibold tracking-[0.18em] whitespace-nowrap uppercase sm:text-sm">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i} className="flex items-center gap-10">
              {m}
              <svg viewBox="0 0 10 10" className="h-2 w-2 fill-white/80"><path d="M5 0l5 5-5 5-5-5z" /></svg>
            </span>
          ))}
        </div>
      </div>

      {/* STATS BAR */}
      <section className="border-b border-slate-100 bg-white">
        <div className="container-x grid grid-cols-2 divide-slate-100 lg:grid-cols-4 lg:divide-x">
          {s.stats.map((st, idx) => {
            const Icons = [Layers, Award, Globe2, ShieldCheck];
            const Icon = Icons[idx % Icons.length];
            return (
              <div key={st.label} className="reveal flex flex-col items-center px-4 py-9 text-center">
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="font-display text-3xl font-bold text-navy-950 sm:text-4xl">{st.value}</div>
                <div className="mt-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">{st.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CATEGORIES — CRISP ARCHITECTURAL CARDS */}
      <section className="grid-bg-light bg-slate-50 py-20 lg:py-24">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHead
              eyebrow="What we manufacture"
              title={<>Product categories built for <span className="text-brand-600">critical service</span></>}
              desc="Four core manufacturing divisions delivering complete, leak-proof piping and jointing systems."
            />
            <Link href="/products" className="btn-ghost reveal shrink-0 bg-white">All products <ArrowRight className="h-4 w-4" /></Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cats.map((c, i) => (
              <Link
                key={c.id}
                href={`/products/category/${c.slug}`}
                className="group reveal flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-[0_28px_60px_-24px_rgb(18,33,59,0.25)]"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b border-slate-100 bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-full w-full rounded-xl object-contain transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-navy-950 px-3 py-1 text-[11px] font-bold text-white shadow">
                    0{i + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="w-fit rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold text-brand-600">
                    {count(c.slug)} Products
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-navy-950 transition group-hover:text-brand-600">{c.name}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">{c.description}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-navy-900 group-hover:text-brand-600">
                    <span>Explore range</span>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-navy-50 transition group-hover:rotate-45 group-hover:bg-brand-500 group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20 lg:py-24">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div className="reveal relative">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={aboutPhoto1} alt="Blazetech forged flanges" className="aspect-[4/4] w-full object-cover" />
              </div>
              <div className="col-span-4 flex flex-col gap-4">
                <div className="flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={aboutPhoto2} alt="Industrial piping fittings" className="h-full w-full object-cover" />
                </div>
                <div className="rounded-3xl bg-navy-950 p-5 text-white shadow-xl">
                  <div className="font-display text-2xl font-bold text-brand-400">ASME</div>
                  <div className="mt-1 text-[11px] leading-snug text-navy-200">B16.5 · B16.47<br />SAE J518 · DIN</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <SectionHead eyebrow="About Blazetech" title={s.tagline} />
            <div className="reveal mt-6 space-y-4 leading-relaxed text-slate-600">
              {s.aboutContent.split(/\n\s*\n/).slice(0, 2).map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="reveal mt-7 grid gap-2.5">
              {s.manufactures.map((m) => (
                <div key={m} className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-navy-900">
                  <BadgeCheck className="h-5 w-5 shrink-0 text-brand-500" /> {m}
                </div>
              ))}
            </div>
            <div className="reveal mt-8 flex flex-wrap items-center gap-6">
              <Link href="/about" className="btn-dark">Know more about us <ArrowRight className="h-4 w-4" /></Link>
              <a href={telHref(s.phone)} className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600"><Phone className="h-5 w-5" /></span>
                <span>
                  <span className="block text-xs text-slate-500">Speak with sales</span>
                  <span className="font-display font-bold text-navy-950">{s.phone}</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ALL PRODUCTS SHOWCASE */}
      <section className="border-y border-slate-100 bg-slate-50 py-20 lg:py-24">
        <div className="container-x">
          <SectionHead
            center
            eyebrow="Our complete range"
            title="All Industrial Products"
            desc="Filter by category or explore our full range of ASME flanges, industrial gaskets, camlock couplings and forged fittings."
          />
          <ProductShowcase products={allProducts} categories={cats} whatsapp={s.whatsapp} />
        </div>
      </section>

      {/* WHY US */}
      <section className="relative overflow-hidden bg-navy-950 py-20 lg:py-24">
        <div className="grid-bg absolute inset-0" />
        <FlangeArt className="absolute -bottom-40 -left-40 h-[520px] w-[520px] animate-spin-slow text-white/[0.04]" />
        <div className="relative container-x">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <SectionHead
                light
                eyebrow="Why Blazetech"
                title="Manufacturing excellence you can rely on"
                desc="Our focus is on manufacturing excellence, technical accuracy and dependable delivery — for every order, every size."
              />
              <Link href="/contact#quote" className="btn-primary reveal mt-8">
                Discuss your requirement <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">
              {[
                { i: Hammer, t: "Controlled Forging", d: "Advanced forging ensures superior grain structure, mechanical strength and long service life." },
                { i: Cog, t: "CNC Precision Machining", d: "Tight tolerances, accurate bolt-hole alignment and perfect face finishes on every flange." },
                { i: Microscope, t: "Strict Quality Control", d: "Dimensional, material and visual inspection at each stage — 100% quality checked before dispatch." },
                { i: Ruler, t: "Custom Engineering", d: "Flanges built to client drawings, special sizes, pressure ratings and material grades." },
                { i: ShieldCheck, t: "International Standards", d: "Products conforming to ASME / ANSI, SAE, DIN and ISO for global compatibility." },
                { i: Truck, t: "On-time Global Delivery", d: "Export-ready packaging and reliable logistics to customers across India, UAE and beyond." },
              ].map(({ i: I, t, d: desc }, k) => (
                <div
                  key={t}
                  className="group reveal rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-brand-500/50 hover:bg-white/[0.07]"
                  style={{ transitionDelay: `${k * 50}ms` }}
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-500/15 text-brand-400 transition group-hover:bg-brand-500 group-hover:text-white">
                    <I className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-300">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 lg:py-24">
        <div className="container-x">
          <SectionHead center eyebrow="Our process" title="From raw material to dispatch" desc="Controlled quality at every step of the manufacturing workflow." />
          <div className="relative mt-14 grid gap-8 md:grid-cols-5">
            <div className="absolute top-8 right-[10%] left-[10%] hidden h-px border-t-2 border-dashed border-slate-200 md:block" />
            {[
              { i: Flame, t: "Raw Material", d: "Certified CS, SS & alloy steel sourcing" },
              { i: Hammer, t: "Forging", d: "Controlled hot forging for strength" },
              { i: Cog, t: "Machining", d: "CNC turning, facing & drilling" },
              { i: Microscope, t: "Inspection", d: "Dimensional & material testing" },
              { i: PackageCheck, t: "Dispatch", d: "Marked, packed & shipped on time" },
            ].map(({ i: I, t, d: desc }, k) => (
              <div key={t} className="reveal relative text-center" style={{ transitionDelay: `${k * 70}ms` }}>
                <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-navy-900 shadow-lg ring-1 ring-slate-200/80">
                  <I className="h-7 w-7 text-navy-900" />
                  <span className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-brand-500 text-[11px] font-bold text-white shadow">
                    {k + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-bold text-navy-950">{t}</h3>
                <p className="mt-1 text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="bg-slate-50 py-20 lg:py-24">
        <div className="container-x">
          <SectionHead center eyebrow="Industries we serve" title="Trusted across process industries" />
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { i: Fuel, t: "Oil & Gas" }, { i: Zap, t: "Power Plants" }, { i: FlaskConical, t: "Chemical & Petrochemical" }, { i: Droplets, t: "Water Pipelines" },
              { i: Ship, t: "Marine & Offshore" }, { i: Gauge, t: "Hydraulic Systems" }, { i: Building2, t: "Construction" }, { i: Factory, t: "Heavy Engineering" },
            ].map(({ i: I, t }, k) => (
              <div
                key={t}
                className="group reveal flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl"
                style={{ transitionDelay: `${k * 35}ms` }}
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-800 transition group-hover:bg-navy-950 group-hover:text-brand-400">
                  <I className="h-6 w-6" />
                </div>
                <span className="text-sm font-semibold text-navy-950 sm:text-base">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      {d.gallery.length > 0 && (
        <section className="py-20 lg:py-24">
          <div className="container-x">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <SectionHead eyebrow="Image gallery" title="Pictures that speak" />
              <Link href="/gallery" className="btn-ghost reveal shrink-0">View gallery <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-12 grid auto-rows-[185px] grid-cols-2 gap-4 md:grid-cols-4">
              {d.gallery.slice(0, 6).map((g, i) => (
                <Link
                  key={g.id}
                  href="/gallery"
                  className={`group reveal relative overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 ${i === 0 ? "col-span-2 row-span-2" : ""} ${i === 3 ? "row-span-2" : ""}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.image} alt={g.caption || "Blazetech gallery"} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-navy-950/0 transition group-hover:bg-navy-950/25" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-x">
        <div className="reveal relative overflow-hidden rounded-[32px] bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 px-8 py-14 shadow-2xl sm:px-14 lg:py-16">
          <div className="grid-bg absolute inset-0" />
          <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl" />
          <FlangeArt className="absolute -top-20 -right-20 h-80 w-80 animate-spin-slow text-white/10" />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="eyebrow !text-brand-400">Custom Manufacturing</span>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Have any custom requirements?</h2>
              <p className="mt-3 text-base text-navy-200 sm:text-lg">
                Share your drawing, size, material grade and quantity — get a competitive quotation within 24 hours.
              </p>
            </div>
            <div className="flex flex-wrap gap-3.5">
              <Link href="/contact#quote" className="btn-primary !px-7 !py-4">Get a Free Quote <ArrowRight className="h-4 w-4" /></Link>
              {s.brochure && (
                <a href={s.brochure} target="_blank" rel="noopener" className="btn-outline !px-6 !py-4"><Download className="h-4 w-4" /> Brochure</a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-20 bg-slate-50 py-20 lg:mt-24 lg:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHead eyebrow="Common queries" title="Frequently asked questions" desc="Can't find what you're looking for? Our technical team is happy to help." />
            <div className="reveal mt-8 rounded-3xl bg-navy-950 p-7 text-white shadow-xl">
              <h3 className="text-lg font-semibold">Talk to an engineer</h3>
              <p className="mt-1 text-sm text-navy-300">{s.hours}</p>
              <a href={telHref(s.phone)} className="mt-5 flex items-center gap-3 font-display text-2xl font-bold text-brand-400">
                <Phone className="h-6 w-6" /> {s.phone}
              </a>
              <Link href="/faq" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-brand-400">
                See all FAQs <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="space-y-3 lg:col-span-3">
            {d.faqs.slice(0, 6).map((f, i) => (
              <details
                key={f.id}
                className="group reveal rounded-2xl border border-slate-200/80 bg-white p-6 transition open:border-brand-300 open:shadow-lg"
                open={i === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy-950">
                  {f.question}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-50 transition group-open:rotate-45 group-open:bg-brand-500 group-hover:text-white group-open:text-white">
                    <Plus className="h-4 w-4" />
                  </span>
                </summary>
                <p className="mt-4 leading-relaxed text-slate-600">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
