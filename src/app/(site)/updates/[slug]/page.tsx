import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { getData } from "@/lib/db";
import RichText from "@/components/RichText";
import { PageHero, PostCard } from "@/components/site/Cards";
import { EnquiryForm } from "@/components/site/Forms";
import { excerpt, formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = await getData();
  const post = d.posts.find((p) => p.slug === slug && p.published);
  if (!post) return { title: "Update Not Found" };
  return {
    title: post.title,
    description: excerpt(post.content, 160),
    keywords: post.keywords,
    openGraph: { type: "article", images: post.image ? [post.image] : undefined },
  };
}

export default async function UpdateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await getData();
  const post = d.posts.find((p) => p.slug === slug && p.published);
  if (!post) notFound();
  const related = d.posts.filter((p) => p.published && p.id !== post.id).slice(0, 3);

  return (
    <>
      <PageHero
        title={post.title}
        crumbs={[{ label: "Home", href: "/" }, { label: "Latest News", href: "/updates" }, { label: post.title }]}
        image={post.image}
      />

      <section className="py-16">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <article className="lg:col-span-8">
            <div className="mb-6 flex items-center gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5 font-medium text-brand-600"><Calendar className="h-4 w-4" /> {formatDate(post.date)}</span>
              <span>·</span>
              <span>By {d.settings.companyName}</span>
            </div>

            {post.image && (
              <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image} alt={post.title} className="w-full object-cover" />
              </div>
            )}

            <RichText text={post.content} />

            {post.keywords.length > 0 && (
              <div className="mt-10 border-t border-slate-100 pt-6">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase"><Tag className="h-3.5 w-3.5 text-brand-500" /> Keywords</div>
                <div className="flex flex-wrap gap-2">
                  {post.keywords.map((k) => (
                    <Link key={k} href={`/updates?q=${encodeURIComponent(k)}`} className="rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-navy-900 hover:bg-brand-50 hover:text-brand-600">
                      {k}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10">
              <Link href="/updates" className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Back to all updates</Link>
            </div>
          </article>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-3xl bg-navy-950 p-7 text-white shadow-xl">
              <h3 className="text-xl font-bold">Need a quote?</h3>
              <p className="mt-1.5 text-sm text-navy-300">Send us your flange, gasket or fitting requirement.</p>
              <div className="mt-6">
                <EnquiryForm dark products={d.products.map((x) => x.name)} />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="container-x">
            <h2 className="text-2xl font-bold text-navy-950">Related Updates</h2>
            <div className="mt-8 grid gap-7 md:grid-cols-3">
              {related.map((p) => <PostCard key={p.id} p={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
