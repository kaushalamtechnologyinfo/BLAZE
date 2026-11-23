"use server";
import { updateData } from "@/lib/db";
import { uid } from "@/lib/utils";

export type FormState = { ok: boolean; message: string } | null;

export async function submitEnquiry(_: FormState, fd: FormData): Promise<FormState> {
  const get = (k: string) => String(fd.get(k) || "").trim().slice(0, 4000);
  if (get("website")) return { ok: true, message: "Thank you!" }; // honeypot
  const name = get("name"), email = get("email"), phone = get("phone"), message = get("message");
  if (!name || (!email && !phone)) return { ok: false, message: "Please enter your name and an email or phone number." };
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return { ok: false, message: "Please enter a valid email address." };
  await updateData((d) => {
    d.enquiries.unshift({ id: uid(), name, email, phone, company: get("company"), product: get("product"), message, date: new Date().toISOString(), read: false });
  });
  return { ok: true, message: "Thank you! Our team will get back to you within 24 hours." };
}

export async function subscribe(_: FormState, fd: FormData): Promise<FormState> {
  const email = String(fd.get("email") || "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, message: "Enter a valid email." };
  await updateData((d) => {
    if (!d.subscribers.some((s) => s.email === email)) d.subscribers.unshift({ id: uid(), email, date: new Date().toISOString() });
  });
  return { ok: true, message: "Subscribed! Thank you." };
}
