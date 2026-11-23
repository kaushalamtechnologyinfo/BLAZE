import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Plus } from "lucide-react";
import { getData } from "@/lib/db";
import { PageHero } from "@/components/site/Cards";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Common queries answered about Blazetech Engineering industrial flanges, standards, materials, custom designs and global shipping.",
};

export default async function FaqPage() {
  const d = await getData();
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: d.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PageHero
        title="Frequently Asked Questions"
        desc="Common queries answered regarding our flanges, materials, standards, testing and global supply."
        crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />
      <section className="py-16">
        <div className="container-x max-w-4xl">
          <div className="space-y-4">
            {d.faqs.map((f, i) => (
              <details key={f.id} className="group reveal rounded-2xl bg-white p-6 ring-1 ring-slate-200/80 open:shadow-lg open:ring-brand-500/40" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-navy-950">
                  <span><span className="mr-3 text-sm font-bold text-brand-500">{String(i + 1).padStart(2, "0")}</span>{f.question}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-50 transition group-open:rotate-45 group-open:bg-brand-500 group-open:text-white"><Plus className="h-4 w-4" /></span>
                </summary>
                <p className="mt-4 pl-8 leading-relaxed text-slate-600">{f.answer}</p>
              </details>
            ))}
          </div>

          <div className="mt-14 rounded-3xl bg-navy-950 p-10 text-center text-white">
            <h2 className="text-2xl font-bold">Have a different query?</h2>
            <p className="mt-2 text-navy-200">Please feel free to contact us by submitting a business inquiry.</p>
            <Link href="/contact#quote" className="btn-primary mt-6">Contact Us <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
