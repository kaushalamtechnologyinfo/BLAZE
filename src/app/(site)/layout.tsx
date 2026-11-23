import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import FloatingActions from "@/components/site/FloatingActions";
import RevealProvider from "@/components/site/Reveal";
import { getData } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const d = await getData();
  const categories = [...d.categories].sort((a, b) => a.order - b.order);
  const pages = d.pages.filter((p) => p.published).map(({ slug, title }) => ({ slug, title }));
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: d.settings.companyName,
    url: "https://www.blazetechengineering.in",
    logo: d.settings.logo,
    email: d.settings.email,
    telephone: d.settings.phone,
    address: { "@type": "PostalAddress", streetAddress: d.settings.address, addressLocality: "Ahmedabad", addressRegion: "Gujarat", postalCode: "382445", addressCountry: "IN" },
    sameAs: [d.settings.facebook, d.settings.instagram, d.settings.linkedin].filter(Boolean),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <Header settings={d.settings} categories={categories} pages={pages} />
      <main>{children}</main>
      <Footer settings={d.settings} categories={categories} />
      <FloatingActions phone={d.settings.phone} whatsapp={d.settings.whatsapp} />
      <RevealProvider />
    </>
  );
}
