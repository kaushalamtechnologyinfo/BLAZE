import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <div className="font-display text-7xl font-bold text-brand-500">404</div>
      <h1 className="mt-4 text-2xl font-bold text-navy-950 sm:text-3xl">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">The page you are looking for may have moved or been removed.</p>
      <Link href="/" className="btn-primary mt-8"><ArrowLeft className="h-4 w-4" /> Back to Homepage</Link>
    </div>
  );
}
