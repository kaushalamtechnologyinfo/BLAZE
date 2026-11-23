import Link from "next/link";
import type { Metadata } from "next";
import { Download, Search } from "lucide-react";
import { getData } from "@/lib/db";
import { PageHero, ProductCard } from "@/components/site/Cards";
import { ContactStrip, SubcategoryTags } from "@/components/site/ProductsExtras";

export const metadata: Metadata = {
  title: "All Products",
  description: "Top Industrial Flange, Gaskets & Sealing Solution, Industrial Forge Fittings and Camlock Couplings at best prices in Ahmedabad | Blazetech Engineering.",
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q = "", category = "" } = await searchParams;
  const d = await getData();
  const cats = [...d.categories].sort((a, b) => a.order - b.order);
  const catMap = Object.fromEntries(cats.map((c) => [c.slug, c]));
  const query = q.trim().toLowerCase();

  const items = [...d.products]
    .sort((a, b) => a.order - b.order)
    .filter((p) => !category || p.category === category)
    .filter((p) => !query || `${p.name} ${p.description} ${catMap[p.category]?.name || ""}`.toLowerCase().includes(query));

  return (
    <>
      <PageHero
        title="All Products"
        desc="Explore all 24 precision-engineered Industrial Flanges, Gaskets & Sealing Solutions, Industrial Forge Fittings and Camlock Couplings manufactured in Ahmedabad."
        crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />

      <section className="bg-slate-50/60 py-14">
        <div className="container-x">
          {/* Elevated filter & search bar */}
          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between lg:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/products"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${!category ? "bg-navy-950 text-white shadow" : "bg-slate-100 text-navy-900 hover:bg-slate-200"}`}
              >
                All Products ({d.products.length})
              </Link>
              {cats.map((c) => {
                const n = d.products.filter((p) => p.category === c.slug).length;
                return (
                  <Link
                    key={c.id}
                    href={`/products/category/${c.slug}`}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${category === c.slug ? "bg-brand-500 text-white shadow" : "bg-slate-100 text-navy-900 hover:bg-slate-200"}`}
                  >
                    {c.name} ({n})
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2.5">
              <form action="/products" className="relative flex-1 lg:w-64">
                <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input name="q" defaultValue={q} placeholder="Search products…" className="input !rounded-full !pl-10" />
              </form>
              {d.settings.brochure && (
                <a href={d.settings.brochure} target="_blank" rel="noopener" className="hidden items-center gap-1.5 rounded-full bg-brand-50 px-4 py-2.5 text-xs font-bold text-brand-600 transition hover:bg-brand-500 hover:text-white sm:inline-flex">
                  <Download className="h-3.5 w-3.5" /> Brochure
                </a>
              )}
            </div>
          </div>

          {query && (
            <div className="mt-6 flex items-center gap-3 text-sm text-slate-500">
              Showing <strong>{items.length}</strong> result{items.length === 1 ? "" : "s"} for <strong className="text-navy-950">&ldquo;{q}&rdquo;</strong>
              <Link href="/products" className="font-semibold text-brand-600 underline">Clear filter</Link>
            </div>
          )}

          {items.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <ProductCard key={p.id} p={p} category={catMap[p.category]} whatsapp={d.settings.whatsapp} />
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center">
              <p className="text-lg font-bold text-navy-900">No matching products found</p>
              <p className="mt-2 text-sm text-slate-500">Try a different keyword or contact us for custom manufacturing as per your drawing.</p>
              <div className="mt-6 flex justify-center gap-3">
                <Link href="/products" className="btn-ghost">Show All Products</Link>
                <Link href="/contact#quote" className="btn-primary">Request Custom Product</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <SubcategoryTags tags={d.settings.subcategoryTags} />
      <ContactStrip settings={d.settings} />
    </>
  );
}
