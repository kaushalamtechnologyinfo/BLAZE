import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getData } from "@/lib/db";
import RichText from "@/components/RichText";
import { PageHero } from "@/components/site/Cards";
import { EnquiryForm } from "@/components/site/Forms";
import { excerpt } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = await getData();
  const page = d.pages.find((p) => p.slug === slug && p.published);
  if (!page) return { title: "Page Not Found" };
  return { title: page.title, description: excerpt(page.content, 160), openGraph: { images: page.image ? [page.image] : undefined } };
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await getData();
  const page = d.pages.find((p) => p.slug === slug && p.published);
  if (!page) notFound();
  const others = d.pages.filter((p) => p.published && p.slug !== slug);

  return (
    <>
      <PageHero
        title={page.title}
        crumbs={[{ label: "Home", href: "/" }, { label: page.title }]}
        image={page.image}
      />
      <section className="py-16">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {page.image && (
              <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={page.image} alt={page.title} className="w-full object-cover" />
              </div>
            )}
            <RichText text={page.content} />
            {others.length > 0 && (
              <div className="mt-12 border-t border-slate-100 pt-8">
                <h3 className="text-sm font-bold tracking-wider text-slate-500 uppercase">Related Pages</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  {others.map((o) => (
                    <Link key={o.slug} href={`/pages/${o.slug}`} className="btn-ghost">{o.title}</Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-3xl bg-navy-950 p-7 text-white shadow-xl">
              <h3 className="text-xl font-bold">Request a Quote</h3>
              <p className="mt-1.5 text-sm text-navy-300">Share your specifications for fast pricing.</p>
              <div className="mt-6">
                <EnquiryForm dark products={d.products.map((p) => p.name)} />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
