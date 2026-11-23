import type { Metadata } from "next";
import { Download, ExternalLink, FileText } from "lucide-react";
import { getData } from "@/lib/db";
import { PageHero } from "@/components/site/Cards";

export const metadata: Metadata = {
  title: "Product Brochure",
  description: "View or download the official Blazetech Engineering product catalogue and company brochure (PDF).",
};

export default async function BrochurePage() {
  const { settings: s } = await getData();
  return (
    <>
      <PageHero
        title="Company &amp; Product Brochure"
        desc="Download our complete catalogue of ASME industrial flanges, gaskets, camlock couplings and forged fittings."
        crumbs={[{ label: "Home", href: "/" }, { label: "Brochure" }]}
      />
      <section className="py-16">
        <div className="container-x">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-500 text-white"><FileText className="h-6 w-6" /></div>
              <div>
                <h2 className="font-bold text-navy-950">{s.companyName} — Product Catalogue</h2>
                <p className="text-sm text-slate-500">Official PDF brochure with specifications &amp; product range</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={s.brochure} download className="btn-primary"><Download className="h-4 w-4" /> Download PDF</a>
              <a href={s.brochure} target="_blank" rel="noopener" className="btn-ghost"><ExternalLink className="h-4 w-4" /> Open in new tab</a>
            </div>
          </div>

          {s.brochure && (
            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-lg">
              <iframe src={s.brochure} title="Blazetech Engineering Brochure" className="h-[80vh] min-h-[600px] w-full" />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
