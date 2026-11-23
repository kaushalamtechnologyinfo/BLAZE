"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2, Download, ExternalLink, FileText, FolderKanban, HelpCircle, Image as ImageIcon,
  Inbox, LayoutDashboard, Loader2, LogOut, Mail, Menu, Newspaper, Package, Pencil, Plus, Save,
  Search, Settings as SettingsIcon, Star, Trash2, Upload, Users, X,
} from "lucide-react";
import type { Category, Enquiry, Faq, GalleryItem, Page, Post, Product, Settings, SiteData } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import UploadField from "./UploadField";

type Tab = "dashboard" | "products" | "categories" | "posts" | "gallery" | "pages" | "faqs" | "enquiries" | "subscribers" | "settings";

export default function AdminApp({ initial }: { initial: SiteData }) {
  const router = useRouter();
  const [data, setData] = useState<SiteData>(initial);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast((t) => (t === msg ? "" : t)), 2800);
  };

  async function refresh() {
    const r = await fetch("/api/admin/data", { cache: "no-store" });
    if (r.ok) setData(await r.json());
  }

  async function saveItem(col: string, item: Record<string, unknown>, isNew: boolean) {
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/collection/${col}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!r.ok) throw new Error("Save failed");
      await refresh();
      notify(isNew ? "Created successfully" : "Saved changes");
      return true;
    } catch {
      notify("Error saving item");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function deleteItem(col: string, id: string) {
    if (!confirm("Delete this item permanently?")) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/collection/${col}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (r.ok) {
        await refresh();
        notify("Deleted");
      }
    } finally {
      setBusy(false);
    }
  }

  async function saveSettings(next: Settings) {
    setBusy(true);
    try {
      const r = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (r.ok) {
        await refresh();
        notify("Settings updated");
      }
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const unread = data.enquiries.filter((e) => !e.read).length;

  const nav: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package, badge: data.products.length },
    { id: "categories", label: "Categories", icon: FolderKanban, badge: data.categories.length },
    { id: "posts", label: "Latest News", icon: Newspaper, badge: data.posts.length },
    { id: "gallery", label: "Gallery", icon: ImageIcon, badge: data.gallery.length },
    { id: "pages", label: "Custom Pages", icon: FileText, badge: data.pages.length },
    { id: "faqs", label: "FAQs", icon: HelpCircle, badge: data.faqs.length },
    { id: "enquiries", label: "Enquiries", icon: Inbox, badge: unread || undefined },
    { id: "subscribers", label: "Subscribers", icon: Users, badge: data.subscribers.length || undefined },
    { id: "settings", label: "Site Settings", icon: SettingsIcon },
  ];

  const Sidebar = (
    <div className="flex h-full flex-col bg-navy-950 text-navy-200">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 font-display text-sm font-bold text-white">BT</div>
          <div>
            <div className="font-display text-sm font-bold text-white">Blazetech CMS</div>
            <div className="text-[11px] text-navy-400">Admin Panel</div>
          </div>
        </div>
        <button onClick={() => setMenuOpen(false)} className="lg:hidden"><X className="h-5 w-5" /></button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map(({ id, label, icon: I, badge }) => (
          <button
            key={id}
            onClick={() => { setTab(id); setMenuOpen(false); }}
            className={cn(
              "flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
              tab === id ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" : "text-navy-200 hover:bg-white/5 hover:text-white"
            )}
          >
            <span className="flex items-center gap-3"><I className="h-4 w-4" /> {label}</span>
            {badge !== undefined && (
              <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold", tab === id ? "bg-white/20 text-white" : id === "enquiries" ? "bg-brand-500 text-white" : "bg-white/10 text-navy-300")}>
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-3">
        <Link href="/" target="_blank" className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm text-navy-200 hover:bg-white/5 hover:text-white">
          <ExternalLink className="h-4 w-4 text-brand-400" /> View Live Website
        </Link>
        <button onClick={logout} className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm text-red-300 hover:bg-red-500/10">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">{Sidebar}</aside>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-navy-950/60" />
          <div className="relative h-full w-64">{Sidebar}</div>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(true)} className="rounded-lg border border-slate-200 p-2 lg:hidden"><Menu className="h-5 w-5" /></button>
            <h1 className="font-display text-lg font-bold text-navy-950 capitalize">{nav.find((n) => n.id === tab)?.label}</h1>
          </div>
          <div className="flex items-center gap-3">
            {busy && <Loader2 className="h-4 w-4 animate-spin text-brand-500" />}
            <Link href="/" target="_blank" className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-navy-900 hover:bg-slate-50 sm:inline-flex">
              Open Site <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8">
          {tab === "dashboard" && <DashboardView data={data} go={setTab} />}
          {tab === "products" && <ProductsView data={data} onSave={(it, n) => saveItem("products", it, n)} onDelete={(id) => deleteItem("products", id)} />}
          {tab === "categories" && <CategoriesView categories={data.categories} onSave={(it, n) => saveItem("categories", it, n)} onDelete={(id) => deleteItem("categories", id)} />}
          {tab === "posts" && <PostsView posts={data.posts} onSave={(it, n) => saveItem("posts", it, n)} onDelete={(id) => deleteItem("posts", id)} />}
          {tab === "gallery" && <GalleryView items={data.gallery} onSave={(it, n) => saveItem("gallery", it, n)} onDelete={(id) => deleteItem("gallery", id)} />}
          {tab === "pages" && <PagesView pages={data.pages} onSave={(it, n) => saveItem("pages", it, n)} onDelete={(id) => deleteItem("pages", id)} />}
          {tab === "faqs" && <FaqsView faqs={data.faqs} onSave={(it, n) => saveItem("faqs", it, n)} onDelete={(id) => deleteItem("faqs", id)} />}
          {tab === "enquiries" && <EnquiriesView items={data.enquiries} onSave={(it) => saveItem("enquiries", it, false)} onDelete={(id) => deleteItem("enquiries", id)} />}
          {tab === "subscribers" && <SubscribersView items={data.subscribers} onDelete={(id) => deleteItem("subscribers", id)} />}
          {tab === "settings" && <SettingsView settings={data.settings} onSave={saveSettings} />}
        </main>
      </div>

      {toast && (
        <div className="fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-xl bg-navy-950 px-4 py-3 text-sm font-medium text-white shadow-2xl">
          <CheckCircle2 className="h-4 w-4 text-green-400" /> {toast}
        </div>
      )}
    </div>
  );
}

/* ==================== DASHBOARD ==================== */
function DashboardView({ data, go }: { data: SiteData; go: (t: Tab) => void }) {
  const unread = data.enquiries.filter((e) => !e.read).length;
  const cards = [
    { label: "Products", value: data.products.length, tab: "products" as Tab, color: "bg-navy-950 text-white" },
    { label: "Categories", value: data.categories.length, tab: "categories" as Tab, color: "bg-white text-navy-950" },
    { label: "Latest News", value: data.posts.length, tab: "posts" as Tab, color: "bg-white text-navy-950" },
    { label: "Gallery Photos", value: data.gallery.length, tab: "gallery" as Tab, color: "bg-white text-navy-950" },
    { label: "Unread Enquiries", value: unread, tab: "enquiries" as Tab, color: unread ? "bg-brand-500 text-white" : "bg-white text-navy-950" },
    { label: "Subscribers", value: data.subscribers.length, tab: "subscribers" as Tab, color: "bg-white text-navy-950" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <button key={c.label} onClick={() => go(c.tab)} className={cn("rounded-2xl border border-slate-200 p-6 text-left transition hover:-translate-y-0.5 hover:shadow-lg", c.color)}>
            <div className="text-xs font-semibold tracking-wider uppercase opacity-70">{c.label}</div>
            <div className="mt-2 font-display text-3xl font-bold">{c.value}</div>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-navy-950">Recent Enquiries</h2>
            <button onClick={() => go("enquiries")} className="text-xs font-semibold text-brand-600 hover:underline">View all</button>
          </div>
          {data.enquiries.length === 0 ? (
            <p className="mt-6 text-sm text-slate-400">No enquiries yet. Quote form submissions will appear here.</p>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {data.enquiries.slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-navy-950">
                      {!e.read && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                      {e.name} {e.product && <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-normal text-slate-600">{e.product}</span>}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{e.message || e.email || e.phone}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">{formatDate(e.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-navy-950">Quick Actions</h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {([
              ["Add / Edit Products", "products"],
              ["Publish Latest Update", "posts"],
              ["Upload Gallery Photos", "gallery"],
              ["Update Contact & Logo", "settings"],
            ] as [string, Tab][]).map(([label, t]) => (
              <button key={label} onClick={() => go(t)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-left text-sm font-semibold text-navy-900 transition hover:border-brand-500 hover:bg-brand-50">
                {label} →
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== PRODUCTS ==================== */
function ProductsView({ data, onSave, onDelete }: { data: SiteData; onSave: (i: Record<string, unknown>, n: boolean) => Promise<boolean>; onDelete: (id: string) => void }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const items = data.products
    .filter((p) => !cat || p.category === cat)
    .filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()));

  const startNew = () => {
    setIsNew(true);
    setEditing({ name: "", slug: "", category: data.categories[0]?.slug || "", shortDescription: "", description: "", images: [], featured: false, inStock: true, order: 0 });
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing?.name) return;
    if (await onSave(editing as Record<string, unknown>, isNew)) setEditing(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="input !w-60 !pl-9" />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="input !w-52">
            <option value="">All Categories</option>
            {data.categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <button onClick={startNew} className="btn-primary !rounded-xl !py-2.5"><Plus className="h-4 w-4" /> Add Product</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.images[0] || data.settings.aboutImage} alt="" className="h-11 w-14 rounded-lg border border-slate-200 object-cover" />
                      <div>
                        <div className="font-semibold text-navy-950">{p.name}</div>
                        <div className="text-xs text-slate-400">/products/{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{data.categories.find((c) => c.slug === p.category)?.name || p.category}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => onSave({ id: p.id, featured: !p.featured }, false)} className={cn("rounded-full p-1.5", p.featured ? "bg-amber-100 text-amber-600" : "text-slate-300 hover:text-slate-500")} title="Toggle featured">
                      <Star className={cn("h-4 w-4", p.featured && "fill-current")} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => onSave({ id: p.id, inStock: !p.inStock }, false)} className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", p.inStock ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500")}>
                      {p.inStock ? "In Stock" : "Out"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => { setIsNew(false); setEditing(p); }} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-navy-950"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => onDelete(p.id)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <Modal title={isNew ? "Add Product" : `Edit: ${editing.name}`} onClose={() => setEditing(null)}>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Product Name *</label><input required value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input" /></div>
              <div>
                <label className="label">Category *</label>
                <select value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="input">
                  {data.categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div><label className="label">URL Slug (auto if blank)</label><input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="input" /></div>
              <div><label className="label">Display Order</label><input type="number" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} className="input" /></div>
            </div>
            <UploadField label="Main Product Image" folder="products" value={editing.images?.[0] || ""} onChange={(u) => setEditing({ ...editing, images: u ? [u, ...(editing.images || []).slice(1)] : [] })} />
            <div><label className="label">Short Summary</label><textarea rows={2} value={editing.shortDescription || ""} onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })} className="input" /></div>
            <div><label className="label">Full Description &amp; Technical Specifications</label><textarea rows={10} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input font-mono text-xs" /></div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Featured on homepage</label>
              <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={editing.inStock !== false} onChange={(e) => setEditing({ ...editing, inStock: e.target.checked })} /> In stock</label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost !rounded-xl !py-2.5">Cancel</button>
              <button className="btn-primary !rounded-xl !py-2.5"><Save className="h-4 w-4" /> Save Product</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ==================== CATEGORIES ==================== */
function CategoriesView({ categories, onSave, onDelete }: { categories: Category[]; onSave: (i: Record<string, unknown>, n: boolean) => Promise<boolean>; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [isNew, setIsNew] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing?.name) return;
    if (await onSave(editing as Record<string, unknown>, isNew)) setEditing(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => { setIsNew(true); setEditing({ name: "", slug: "", description: "", image: "", order: categories.length }); }} className="btn-primary !rounded-xl !py-2.5">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...categories].sort((a, b) => a.order - b.order).map((c) => (
          <div key={c.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {c.image && <img src={c.image} alt={c.name} className="aspect-[16/10] w-full object-cover" />}
            <div className="p-4">
              <div className="font-bold text-navy-950">{c.name}</div>
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">{c.description}</p>
              <div className="mt-4 flex justify-end gap-1">
                <button onClick={() => { setIsNew(false); setEditing(c); }} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => onDelete(c.id)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <Modal title={isNew ? "Add Category" : `Edit: ${editing.name}`} onClose={() => setEditing(null)}>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Name *</label><input required value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input" /></div>
              <div><label className="label">Order</label><input type="number" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} className="input" /></div>
            </div>
            <UploadField label="Category Image" folder="products" value={editing.image || ""} onChange={(u) => setEditing({ ...editing, image: u })} />
            <div><label className="label">Description</label><textarea rows={3} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input" /></div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost !rounded-xl !py-2.5">Cancel</button>
              <button className="btn-primary !rounded-xl !py-2.5"><Save className="h-4 w-4" /> Save</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ==================== POSTS / LATEST NEWS ==================== */
function PostsView({ posts, onSave, onDelete }: { posts: Post[]; onSave: (i: Record<string, unknown>, n: boolean) => Promise<boolean>; onDelete: (id: string) => void }) {
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Partial<Post> & { kwText?: string } | null>(null);
  const [isNew, setIsNew] = useState(false);

  const items = posts.filter((p) => !q || p.title.toLowerCase().includes(q.toLowerCase()));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing?.title) return;
    const { kwText, ...rest } = editing;
    const payload = { ...rest, keywords: (kwText || "").split(",").map((s) => s.trim()).filter(Boolean) };
    if (await onSave(payload, isNew)) setEditing(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${posts.length} updates…`} className="input !w-72 !pl-9" />
        </div>
        <button onClick={() => { setIsNew(true); setEditing({ title: "", content: "", image: "", keywords: [], kwText: "", date: new Date().toISOString(), published: true }); }} className="btn-primary !rounded-xl !py-2.5">
          <Plus className="h-4 w-4" /> New Update
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="max-h-[68vh] overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 border-b border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.slice(0, 60).map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {p.image && <img src={p.image} alt="" className="h-10 w-14 rounded-lg object-cover" />}
                      <span className="line-clamp-1 font-medium text-navy-950">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap text-slate-500">{formatDate(p.date)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => onSave({ id: p.id, published: !p.published }, false)} className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", p.published ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500")}>
                      {p.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => { setIsNew(false); setEditing({ ...p, kwText: p.keywords.join(", ") }); }} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => onDelete(p.id)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <Modal title={isNew ? "New Update" : "Edit Update"} onClose={() => setEditing(null)}>
          <form onSubmit={submit} className="space-y-4">
            <div><label className="label">Title *</label><input required value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="input" /></div>
            <UploadField label="Cover Image" folder="posts" value={editing.image || ""} onChange={(u) => setEditing({ ...editing, image: u })} />
            <div><label className="label">Content</label><textarea rows={9} value={editing.content || ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className="input" /></div>
            <div><label className="label">Keywords (comma separated)</label><input value={editing.kwText || ""} onChange={(e) => setEditing({ ...editing, kwText: e.target.value })} className="input" /></div>
            <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={editing.published !== false} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} /> Published</label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost !rounded-xl !py-2.5">Cancel</button>
              <button className="btn-primary !rounded-xl !py-2.5"><Save className="h-4 w-4" /> Save Post</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ==================== GALLERY ==================== */
function GalleryView({ items, onSave, onDelete }: { items: GalleryItem[]; onSave: (i: Record<string, unknown>, n: boolean) => Promise<boolean>; onDelete: (id: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const f of files) {
        const fd = new FormData();
        fd.append("file", f);
        fd.append("folder", "gallery");
        const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const j = await r.json();
        if (r.ok && j.url) await onSave({ image: j.url, caption: "" }, true);
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <label className="btn-primary cursor-pointer !rounded-xl !py-2.5">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload Photos
          <input type="file" multiple accept="image/*" onChange={onFiles} className="hidden" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((g) => (
          <div key={g.id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.image} alt={g.caption} className="aspect-square w-full object-cover" />
            <button onClick={() => onDelete(g.id)} className="absolute top-2.5 right-2.5 grid h-8 w-8 place-items-center rounded-full bg-navy-950/80 text-white hover:bg-red-600" title="Delete">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==================== CUSTOM PAGES ==================== */
function PagesView({ pages, onSave, onDelete }: { pages: Page[]; onSave: (i: Record<string, unknown>, n: boolean) => Promise<boolean>; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState<Partial<Page> | null>(null);
  const [isNew, setIsNew] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing?.title) return;
    if (await onSave(editing as Record<string, unknown>, isNew)) setEditing(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => { setIsNew(true); setEditing({ title: "", slug: "", content: "", image: "", published: true }); }} className="btn-primary !rounded-xl !py-2.5">
          <Plus className="h-4 w-4" /> Add Page
        </button>
      </div>
      <div className="space-y-3">
        {pages.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {p.image && <img src={p.image} alt="" className="h-12 w-16 rounded-lg object-cover" />}
              <div>
                <div className="font-semibold text-navy-950">{p.title}</div>
                <div className="text-xs text-slate-400">/pages/{p.slug}</div>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setIsNew(false); setEditing(p); }} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => onDelete(p.id)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <Modal title={isNew ? "Add Custom Page" : "Edit Page"} onClose={() => setEditing(null)}>
          <form onSubmit={submit} className="space-y-4">
            <div><label className="label">Page Title *</label><input required value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="input" /></div>
            <div><label className="label">URL Slug</label><input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="input" /></div>
            <UploadField label="Banner Image" folder="pages" value={editing.image || ""} onChange={(u) => setEditing({ ...editing, image: u })} />
            <div><label className="label">Content</label><textarea rows={10} value={editing.content || ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className="input" /></div>
            <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={editing.published !== false} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} /> Published</label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost !rounded-xl !py-2.5">Cancel</button>
              <button className="btn-primary !rounded-xl !py-2.5"><Save className="h-4 w-4" /> Save Page</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ==================== FAQS ==================== */
function FaqsView({ faqs, onSave, onDelete }: { faqs: Faq[]; onSave: (i: Record<string, unknown>, n: boolean) => Promise<boolean>; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState<Partial<Faq> | null>(null);
  const [isNew, setIsNew] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing?.question) return;
    if (await onSave(editing as Record<string, unknown>, isNew)) setEditing(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => { setIsNew(true); setEditing({ question: "", answer: "" }); }} className="btn-primary !rounded-xl !py-2.5">
          <Plus className="h-4 w-4" /> Add FAQ
        </button>
      </div>
      <div className="space-y-3">
        {faqs.map((f) => (
          <div key={f.id} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
            <div>
              <div className="font-semibold text-navy-950">{f.question}</div>
              <p className="mt-1 text-sm text-slate-600">{f.answer}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <button onClick={() => { setIsNew(false); setEditing(f); }} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => onDelete(f.id)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <Modal title={isNew ? "Add FAQ" : "Edit FAQ"} onClose={() => setEditing(null)}>
          <form onSubmit={submit} className="space-y-4">
            <div><label className="label">Question *</label><input required value={editing.question || ""} onChange={(e) => setEditing({ ...editing, question: e.target.value })} className="input" /></div>
            <div><label className="label">Answer *</label><textarea required rows={4} value={editing.answer || ""} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} className="input" /></div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost !rounded-xl !py-2.5">Cancel</button>
              <button className="btn-primary !rounded-xl !py-2.5"><Save className="h-4 w-4" /> Save FAQ</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ==================== ENQUIRIES ==================== */
function EnquiriesView({ items, onSave, onDelete }: { items: Enquiry[]; onSave: (i: Record<string, unknown>) => void; onDelete: (id: string) => void }) {
  if (!items.length)
    return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center text-slate-400">No enquiries received yet.</div>;
  return (
    <div className="space-y-3">
      {items.map((e) => (
        <div key={e.id} className={cn("rounded-2xl border bg-white p-5", !e.read ? "border-brand-300 bg-brand-50/20" : "border-slate-200")}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-navy-950">{e.name}</span>
                {e.company && <span className="text-xs text-slate-500">({e.company})</span>}
                {e.product && <span className="rounded-full bg-navy-100 px-2.5 py-0.5 text-xs font-semibold text-navy-800">{e.product}</span>}
                {!e.read && <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase">New</span>}
              </div>
              <div className="mt-1 flex flex-wrap gap-4 text-xs text-slate-500">
                {e.email && <a href={`mailto:${e.email}`} className="text-brand-600 hover:underline">{e.email}</a>}
                {e.phone && <a href={`tel:${e.phone}`} className="hover:underline">{e.phone}</a>}
                <span>{formatDate(e.date)}</span>
              </div>
              {e.message && <p className="mt-3 text-sm leading-relaxed text-slate-700">{e.message}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => onSave({ id: e.id, read: !e.read })} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-navy-900 hover:bg-slate-50">
                Mark {e.read ? "Unread" : "Read"}
              </button>
              <button onClick={() => onDelete(e.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ==================== SUBSCRIBERS ==================== */
function SubscribersView({ items, onDelete }: { items: SiteData["subscribers"]; onDelete: (id: string) => void }) {
  function exportCsv() {
    const csv = "Email,Date\n" + items.map((s) => `${s.email},${s.date}`).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "blazetech-subscribers.csv";
    a.click();
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={exportCsv} disabled={!items.length} className="btn-ghost !rounded-xl !py-2"><Download className="h-4 w-4" /> Export CSV</button>
      </div>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center text-slate-400">No newsletter subscribers yet.</div>
      ) : (
        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
          {items.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-5 py-3.5 text-sm">
              <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-brand-500" /> {s.email}</div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400">{formatDate(s.date)}</span>
                <button onClick={() => onDelete(s.id)} className="text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==================== SETTINGS ==================== */
function SettingsView({ settings, onSave }: { settings: Settings; onSave: (s: Settings) => void }) {
  const [f, setF] = useState<Settings>(settings);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(f); }} className="mx-auto max-w-4xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="font-display text-lg font-bold text-navy-950">Company &amp; Contact Information</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label">Company Name</label><input value={f.companyName} onChange={(e) => setF({ ...f, companyName: e.target.value })} className="input" /></div>
        <div><label className="label">Tagline</label><input value={f.tagline} onChange={(e) => setF({ ...f, tagline: e.target.value })} className="input" /></div>
        <div><label className="label">Primary Phone</label><input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className="input" /></div>
        <div><label className="label">Secondary Phone</label><input value={f.phone2 || ""} onChange={(e) => setF({ ...f, phone2: e.target.value })} className="input" /></div>
        <div><label className="label">WhatsApp Number (with country code)</label><input value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} className="input" /></div>
        <div><label className="label">Email</label><input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className="input" /></div>
        <div className="sm:col-span-2"><label className="label">Address</label><input value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} className="input" /></div>
        <div><label className="label">Business Hours</label><input value={f.hours} onChange={(e) => setF({ ...f, hours: e.target.value })} className="input" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Map Latitude</label><input value={f.mapLat} onChange={(e) => setF({ ...f, mapLat: e.target.value })} className="input" /></div>
          <div><label className="label">Map Longitude</label><input value={f.mapLng} onChange={(e) => setF({ ...f, mapLng: e.target.value })} className="input" /></div>
        </div>
      </div>

      <hr className="border-slate-100" />
      <h2 className="font-display text-lg font-bold text-navy-950">Branding &amp; Media</h2>
      <div className="space-y-4">
        <UploadField label="Company Logo" folder="site" value={f.logo} onChange={(u) => setF({ ...f, logo: u })} />
        <UploadField label="Hero / About Facility Image" folder="site" value={f.aboutImage} onChange={(u) => setF({ ...f, aboutImage: u })} />
        <UploadField label="Hero Section Video (MP4 / WebM)" folder="site" accept="video/mp4,video/webm" value={f.heroVideo || ""} onChange={(u) => setF({ ...f, heroVideo: u })} />
        <UploadField label="Product Brochure (PDF)" folder="site" accept="application/pdf" value={f.brochure} onChange={(u) => setF({ ...f, brochure: u })} />
      </div>

      <hr className="border-slate-100" />
      <h2 className="font-display text-lg font-bold text-navy-950">Homepage &amp; About Content</h2>
      <div className="space-y-4">
        <div><label className="label">Hero Subtitle</label><textarea rows={2} value={f.heroSubtitle} onChange={(e) => setF({ ...f, heroSubtitle: e.target.value })} className="input" /></div>
        <div><label className="label">About Us Text</label><textarea rows={6} value={f.aboutContent} onChange={(e) => setF({ ...f, aboutContent: e.target.value })} className="input" /></div>
        <div><label className="label">What We Manufacture (one per line)</label><textarea rows={3} value={f.manufactures.join("\n")} onChange={(e) => setF({ ...f, manufactures: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} className="input" /></div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div><label className="label">Facebook URL</label><input value={f.facebook} onChange={(e) => setF({ ...f, facebook: e.target.value })} className="input" /></div>
          <div><label className="label">Instagram URL</label><input value={f.instagram} onChange={(e) => setF({ ...f, instagram: e.target.value })} className="input" /></div>
          <div><label className="label">LinkedIn URL</label><input value={f.linkedin} onChange={(e) => setF({ ...f, linkedin: e.target.value })} className="input" /></div>
        </div>
        <div><label className="label">Footer SEO Keywords (comma separated)</label><textarea rows={2} value={f.keywords.join(", ")} onChange={(e) => setF({ ...f, keywords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} className="input" /></div>
        <div><label className="label">Terms &amp; Conditions</label><textarea rows={6} value={f.terms} onChange={(e) => setF({ ...f, terms: e.target.value })} className="input" /></div>
      </div>

      <div className="flex justify-end pt-2">
        <button className="btn-primary !rounded-xl !px-7"><Save className="h-4 w-4" /> Save All Settings</button>
      </div>
    </form>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()} className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-display font-bold text-navy-950">{title}</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 hover:bg-slate-200"><X className="h-4 w-4" /></button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
