import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BadgeCheck, ChevronRight, Download, Mail, MessageCircle, Phone } from "lucide-react";
import { getData } from "@/lib/db";
import RichText from "@/components/RichText";
import { ProductCard } from "@/components/site/Cards";
import { EnquiryForm } from "@/components/site/Forms";
import { excerpt, telHref, waHref } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = await getData();
  const p = d.products.find((x) => x.slug === slug);
  if (!p) return { title: "Product Not Found" };
  return {
    title: p.name,
    description: excerpt(p.shortDescription || p.description, 160),
    openGraph: { images: p.images[0] ? [p.images[0]] : undefined },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await getData();
  const p = d.products.find((x) => x.slug === slug);
  if (!p) notFound();
  const cat = d.categories.find((c) => c.slug === p.category);
  const related = d.products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 3);
  const s = d.settings;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image: p.images,
    description: excerpt(p.description, 300),
    brand: { "@type": "Brand", name: s.companyName },
    offers: { "@type": "Offer", availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", priceCurrency: "INR" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="border-b border-slate-100 bg-slate-50">
        <div className="container-x py-4">
          <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            <Link href="/" className="hover:text-navy-900">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/products" className="hover:text-navy-900">Products</Link>
            {cat && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link href={`/products/category/${cat.slug}`} className="hover:text-navy-900">{cat.name}</Link>
              </>
            )}
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-brand-600">{p.name}</span>
          </nav>
        </div>
      </div>

      <section className="py-12 lg:py-16">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="sticky top-24 space-y-4">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images[0] || s.aboutImage} alt={p.name} className="aspect-[16/10] w-full rounded-2xl object-contain" />
              </div>
              {p.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {p.images.map((img, i) => (
                    <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="aspect-square w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="flex flex-wrap items-center gap-3">
              {cat && <Link href={`/products/category/${cat.slug}`} className="rounded-full bg-navy-50 px-3.5 py-1 text-xs font-bold tracking-wider text-navy-800 uppercase">{cat.name}</Link>}
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold ${p.inStock ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                <BadgeCheck className="h-3.5 w-3.5" /> {p.inStock ? "In Stock / Made to Order" : "Made to Order"}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-navy-950 sm:text-4xl">{p.name}</h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600">{p.shortDescription || excerpt(p.description, 220)}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#enquire" className="btn-primary">Request Quote</a>
              <a href={waHref(s.whatsapp, `Hello ${s.companyName}, I am interested in ${p.name}. Please share details and quotation.`)} target="_blank" rel="noopener" className="btn bg-[#25D366] text-white hover:bg-[#1fb857]">
                <MessageCircle className="h-4 w-4" /> WhatsApp Enquiry
              </a>
              <a href={telHref(s.phone)} className="btn-ghost"><Phone className="h-4 w-4" /> {s.phone}</a>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm">
              <div><span className="block text-xs text-slate-500">Manufacturer</span><strong className="text-navy-950">{s.companyName}</strong></div>
              <div><span className="block text-xs text-slate-500">Location</span><strong className="text-navy-950">Ahmedabad, India</strong></div>
              <div><span className="block text-xs text-slate-500">Standards</span><strong className="text-navy-950">ASME / ANSI / SAE / DIN</strong></div>
              <div><span className="block text-xs text-slate-500">Supply</span><strong className="text-navy-950">Domestic &amp; Global Export</strong></div>
            </div>

            {s.brochure && (
              <a href={s.brochure} target="_blank" rel="noopener" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline">
                <Download className="h-4 w-4" /> Download Product Catalogue (PDF)
              </a>
            )}
          </div>
        </div>

        {/* Full description */}
        <div className="container-x mt-16 grid gap-12 lg:grid-cols-12">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-10 lg:col-span-8">
            <h2 className="mb-6 border-b border-slate-100 pb-4 text-2xl font-bold text-navy-950">Product Overview &amp; Specifications</h2>
            <RichText text={p.description} />
          </div>

          <div id="enquire" className="lg:col-span-4">
            <div className="sticky top-24 rounded-3xl bg-navy-950 p-7 text-white shadow-xl">
              <h3 className="text-xl font-bold">Enquire about {p.name}</h3>
              <p className="mt-1.5 text-sm text-navy-300">Share your required size, grade and quantity for a quick quote.</p>
              <div className="mt-6">
                <EnquiryForm dark products={d.products.map((x) => x.name)} defaultProduct={p.name} />
              </div>
              <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-xs text-navy-300">
                <a href={telHref(s.phone)} className="flex items-center gap-2 hover:text-white"><Phone className="h-3.5 w-3.5 text-brand-400" /> {s.phone}</a>
                <a href={`mailto:${s.email}`} className="flex items-center gap-2 hover:text-white"><Mail className="h-3.5 w-3.5 text-brand-400" /> {s.email}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="container-x">
            <h2 className="text-2xl font-bold text-navy-950">Related Products</h2>
            <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => <ProductCard key={r.id} p={r} category={cat} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
