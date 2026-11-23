import type { MetadataRoute } from "next";
import { getData } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || "https://www.blazetechengineering.in";
  const d = await getData();
  const now = new Date();
  return [
    ...["", "/about", "/products", "/updates", "/gallery", "/brochure", "/faq", "/contact", "/terms"].map((p) => ({
      url: base + p,
      lastModified: now,
    })),
    ...d.categories.map((c) => ({ url: `${base}/products/category/${c.slug}`, lastModified: now })),
    ...d.products.map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: now })),
    ...d.posts.filter((p) => p.published).map((p) => ({ url: `${base}/updates/${p.slug}`, lastModified: new Date(p.date) })),
    ...d.pages.filter((p) => p.published).map((p) => ({ url: `${base}/pages/${p.slug}`, lastModified: now })),
  ];
}
