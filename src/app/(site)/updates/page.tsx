import Link from "next/link";
import type { Metadata } from "next";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { getData } from "@/lib/db";
import { PageHero, PostCard } from "@/components/site/Cards";

export const metadata: Metadata = {
  title: "Latest News & Updates",
  description: "Read the latest product updates, export news and technical articles from Blazetech Engineering, Ahmedabad.",
};

const PER_PAGE = 12;

export default async function UpdatesPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  const { page = "1", q = "" } = await searchParams;
  const d = await getData();
  const query = q.trim().toLowerCase();
  const all = d.posts
    .filter((p) => p.published)
    .filter((p) => !query || `${p.title} ${p.content} ${p.keywords.join(" ")}`.toLowerCase().includes(query));

  const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const cur = Math.min(totalPages, Math.max(1, parseInt(page, 10) || 1));
  const items = all.slice((cur - 1) * PER_PAGE, cur * PER_PAGE);
  const href = (p: number) => `/updates?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

  return (
    <>
      <PageHero
        title="Latest News &amp; Updates"
        desc="Product announcements, export milestones and technical guides from our engineering team."
        crumbs={[{ label: "Home", href: "/" }, { label: "Latest News" }]}
      />

      <section className="py-16">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-500">Showing <strong>{items.length}</strong> of <strong>{all.length}</strong> updates</p>
            <form action="/updates" className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input name="q" defaultValue={q} placeholder="Search articles, flanges, cities…" className="input !rounded-full !pl-10" />
            </form>
          </div>

          {items.length > 0 ? (
            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => <PostCard key={p.id} p={p} />)}
            </div>
          ) : (
            <div className="mt-12 rounded-2xl border border-dashed border-slate-300 p-14 text-center">
              <p className="font-semibold text-navy-900">No updates matched your search.</p>
              <Link href="/updates" className="btn-ghost mt-4">Show all updates</Link>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-14 flex items-center justify-center gap-2">
              {cur > 1 && (
                <Link href={href(cur - 1)} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-navy-900 hover:bg-navy-900 hover:text-white">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - cur) <= 2)
                .map((n, idx, arr) => (
                  <span key={n} className="flex items-center gap-2">
                    {idx > 0 && arr[idx - 1] !== n - 1 && <span className="px-1 text-slate-400">…</span>}
                    <Link
                      href={href(n)}
                      className={`grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-semibold transition ${n === cur ? "bg-brand-500 text-white" : "border border-slate-200 text-navy-900 hover:bg-slate-100"}`}
                    >
                      {n}
                    </Link>
                  </span>
                ))}
              {cur < totalPages && (
                <Link href={href(cur + 1)} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-navy-900 hover:bg-navy-900 hover:text-white">
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
