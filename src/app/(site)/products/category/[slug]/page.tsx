import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getData } from "@/lib/db";
import { PageHero, ProductCard } from "@/components/site/Cards";
import { ContactStrip, SubcategoryTags } from "@/components/site/ProductsExtras";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = await getData();
  const cat = d.categories.find((c) => c.slug === slug);
  if (!cat) return { title: "Category Not Found" };
  return { title: cat.name, description: cat.description };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await getData();
  const cats = [...d.categories].sort((a, b) => a.order - b.order);
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) notFound();
  const items = d.products.filter((p) => p.category === cat.slug).sort((a, b) => a.order - b.order);

  return (
    <>
      <PageHero
        title={cat.name}
        desc={cat.description}
        crumbs={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: cat.name }]}
        image={cat.image}
      />

      <section className="bg-slate-50/60 py-14">
        <div className="container-x">
          <div className="flex flex-wrap gap-2 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <Link href="/products" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-slate-200">
              All Products ({d.products.length})
            </Link>
            {cats.map((c) => (
              <Link
                key={c.id}
                href={`/products/category/${c.slug}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${c.slug === slug ? "bg-brand-500 text-white shadow" : "bg-slate-100 text-navy-900 hover:bg-slate-200"}`}
              >
                {c.name} ({d.products.filter((p) => p.category === c.slug).length})
              </Link>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => <ProductCard key={p.id} p={p} category={cat} whatsapp={d.settings.whatsapp} />)}
          </div>
        </div>
      </section>

      <SubcategoryTags tags={d.settings.subcategoryTags} />
      <ContactStrip settings={d.settings} />
    </>
  );
}
