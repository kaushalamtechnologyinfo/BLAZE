"use client";
import { useActionState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { submitEnquiry, subscribe, type FormState } from "@/app/actions";

export function EnquiryForm({ products = [], defaultProduct = "", dark = false }: { products?: string[]; defaultProduct?: string; dark?: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitEnquiry, null);
  if (state?.ok)
    return (
      <div className={`flex flex-col items-center rounded-2xl p-10 text-center ${dark ? "bg-white/5 text-white" : "bg-green-50"}`}>
        <CheckCircle2 className="h-14 w-14 text-green-500" />
        <h3 className={`mt-4 text-xl font-bold ${dark ? "text-white" : "text-navy-950"}`}>Enquiry received</h3>
        <p className={`mt-2 ${dark ? "text-navy-200" : "text-slate-600"}`}>{state.message}</p>
      </div>
    );
  const field = dark ? "input !border-white/10 !bg-white/5 !text-white placeholder:!text-navy-300" : "input";
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <input name="name" required placeholder="Full name *" className={field} />
      <input name="company" placeholder="Company name" className={field} />
      <input name="email" type="email" placeholder="Email address *" className={field} />
      <input name="phone" type="tel" placeholder="Phone / WhatsApp" className={field} />
      <select name="product" defaultValue={defaultProduct} className={`${field} sm:col-span-2`}>
        <option value="">Select product (optional)</option>
        {products.map((p) => <option key={p} value={p} className="text-navy-900">{p}</option>)}
      </select>
      <textarea name="message" rows={4} placeholder="Your requirement — size, material grade, quantity, standard…" className={`${field} sm:col-span-2`} />
      {state && !state.ok && <p className="text-sm text-red-500 sm:col-span-2">{state.message}</p>}
      <button disabled={pending} className="btn-primary sm:col-span-2">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send Enquiry
      </button>
    </form>
  );
}

export function SubscribeForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribe, null);
  return (
    <form action={action} className="w-full">
      <div className="flex rounded-full bg-white/5 p-1.5 ring-1 ring-white/10 focus-within:ring-brand-500">
        <input name="email" type="email" required placeholder="Your email address" className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-navy-300" />
        <button disabled={pending} className="btn-primary !px-5 !py-2.5">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}</button>
      </div>
      {state && <p className={`mt-2 text-xs ${state.ok ? "text-green-400" : "text-red-400"}`}>{state.message}</p>}
    </form>
  );
}
