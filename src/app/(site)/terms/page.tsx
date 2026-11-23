import type { Metadata } from "next";
import { getData } from "@/lib/db";
import RichText from "@/components/RichText";
import { PageHero } from "@/components/site/Cards";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default async function TermsPage() {
  const { settings } = await getData();
  return (
    <>
      <PageHero title="Terms &amp; Conditions" crumbs={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]} />
      <section className="py-16">
        <div className="container-x max-w-4xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12">
            <RichText text={settings.terms} />
          </div>
        </div>
      </section>
    </>
  );
}
