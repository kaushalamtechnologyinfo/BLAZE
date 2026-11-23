import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getData } from "@/lib/db";
import { PageHero } from "@/components/site/Cards";
import { EnquiryForm } from "@/components/site/Forms";
import { telHref, waHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Blazetech Engineering in Vatva, Ahmedabad, Gujarat for industrial flanges, gaskets, camlock couplings and forged fittings.",
};

export default async function ContactPage() {
  const d = await getData();
  const s = d.settings;
  const mapUrl = `https://maps.google.com/maps?q=${s.mapLat},${s.mapLng}&z=15&output=embed`;

  return (
    <>
      <PageHero
        title="Contact Us"
        desc="Have a requirement or need technical assistance? Reach out to our team in Ahmedabad for a fast quotation."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="py-16">
        <div className="container-x">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <a href={telHref(s.phone)} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-500 hover:shadow-lg">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600"><Phone className="h-6 w-6" /></div>
              <h3 className="mt-4 font-semibold text-navy-950">Phone Number</h3>
              <p className="mt-1 text-sm font-medium text-navy-800">{s.phone}</p>
              {s.phone2 && <p className="text-sm text-slate-500">{s.phone2}</p>}
              <p className="mt-1 text-xs text-slate-400">Please keep 0 before dialling.</p>
            </a>

            <a href={`mailto:${s.email}`} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-500 hover:shadow-lg">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600"><Mail className="h-6 w-6" /></div>
              <h3 className="mt-4 font-semibold text-navy-950">Email Address</h3>
              <p className="mt-1 break-all text-sm font-medium text-navy-800">{s.email}</p>
              <p className="mt-1 text-xs text-slate-400">Replies within 24 business hours</p>
            </a>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600"><Clock className="h-6 w-6" /></div>
              <h3 className="mt-4 font-semibold text-navy-950">Business Hours</h3>
              <p className="mt-1 text-sm text-slate-600">{s.hours}</p>
            </div>

            <a href={waHref(s.whatsapp)} target="_blank" rel="noopener" className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-[#25D366] hover:shadow-lg">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-green-50 text-[#25D366]"><MessageCircle className="h-6 w-6" /></div>
              <h3 className="mt-4 font-semibold text-navy-950">Live WhatsApp Chat</h3>
              <p className="mt-1 text-sm text-slate-600">Connect over WhatsApp to resolve your queries realtime.</p>
            </a>
          </div>

          <div id="quote" className="mt-14 grid gap-10 lg:grid-cols-12">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10 lg:col-span-7">
              <span className="eyebrow">Free Quote</span>
              <h2 className="mt-3 text-2xl font-bold text-navy-950 sm:text-3xl">Send us your requirement</h2>
              <p className="mt-2 text-sm text-slate-500">Mention your flange type, size, pressure class, material grade and quantity.</p>
              <div className="mt-8">
                <EnquiryForm products={d.products.map((p) => p.name)} />
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-5">
              <div className="rounded-3xl bg-navy-950 p-7 text-white">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-brand-400" />
                  <div>
                    <h3 className="font-semibold">Registered Office &amp; Works</h3>
                    <p className="mt-1 text-sm leading-relaxed text-navy-200">{s.address}</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 min-h-[340px]">
                <iframe src={mapUrl} title="Blazetech Engineering Location" className="h-full min-h-[340px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
