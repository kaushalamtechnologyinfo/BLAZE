import type { Metadata } from "next";
import { getData } from "@/lib/db";
import { PageHero } from "@/components/site/Cards";
import GalleryGrid from "@/components/site/GalleryGrid";

export const metadata: Metadata = {
  title: "Image Gallery",
  description: "Photos of our precision-forged industrial flanges, gaskets, camlock couplings and manufacturing facility.",
};

export default async function GalleryPage() {
  const d = await getData();
  return (
    <>
      <PageHero
        title="Image Gallery"
        desc="Pictures that speak — explore our forged flanges, gaskets, fittings and machining workshop."
        crumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />
      <section className="py-16">
        <div className="container-x">
          <GalleryGrid items={d.gallery} />
        </div>
      </section>
    </>
  );
}
