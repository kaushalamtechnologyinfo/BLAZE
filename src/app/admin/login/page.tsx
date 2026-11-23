"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setErr(j.error || "Invalid credentials");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid-bg relative flex min-h-screen items-center justify-center bg-navy-950 p-5">
      <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="flex items-center justify-between">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-950 text-brand-400">
            <Lock className="h-5 w-5" />
          </div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to website
          </Link>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-navy-950">Blazetech Admin</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to manage products, updates, gallery, enquiries and site settings.</p>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <div>
            <label className="label">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required className="input" autoComplete="username" />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password" className="input" autoComplete="current-password" />
          </div>
          {err && <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">{err}</p>}
          <button disabled={loading} className="btn-primary w-full !rounded-xl">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Default credentials: <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">admin</code> / <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">admin123</code> (set <code className="text-slate-600">ADMIN_USER</code> &amp; <code className="text-slate-600">ADMIN_PASSWORD</code> in <code className="text-slate-600">.env.local</code>)
        </p>
      </div>
    </div>
  );
}
