import type { Metadata } from "next";
import "./globals.css";
import { getSettings } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(process.env.SITE_URL || "https://www.blazetechengineering.in"),
    title: { default: `${s.companyName} | ${s.tagline}`, template: `%s | ${s.companyName}` },
    description: s.heroSubtitle,
    keywords: ["industrial flanges", "weld neck flange", "slip on flange", "SAE flange", "PTFE gasket", "camlock coupling", "forged fittings", "flange manufacturer Ahmedabad", ...s.keywords],
    openGraph: { type: "website", siteName: s.companyName, images: [s.aboutImage] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
