import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateData } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import type { SiteData } from "@/lib/types";
import { slugify, uid } from "@/lib/utils";

const ALLOWED = ["categories", "products", "posts", "gallery", "pages", "faqs", "enquiries", "subscribers"] as const;
type Col = (typeof ALLOWED)[number];

function isCol(x: string): x is Col {
  return (ALLOWED as readonly string[]).includes(x);
}

export async function POST(req: Request, { params }: { params: Promise<{ name: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { name } = await params;
  if (!isCol(name)) return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  const body = await req.json();

  const item = await updateData((d: SiteData) => {
    const list = d[name] as Array<Record<string, unknown>>;
    const id = String(body.id || uid());
    const rec: Record<string, unknown> = { ...body, id };
    if (name === "categories" || name === "products" || name === "posts" || name === "pages") {
      const base = slugify(String(body.slug || body.name || body.title || id));
      let s = base || id;
      let n = 2;
      while (list.some((x) => x.slug === s)) s = `${base}-${n++}`;
      rec.slug = s;
    }
    if (name === "posts" && !rec.date) rec.date = new Date().toISOString();
    if (name === "products" && rec.order === undefined) rec.order = 0;
    if (name === "categories" && rec.order === undefined) rec.order = list.length;

    if (name === "posts" || name === "gallery") list.unshift(rec);
    else list.push(rec);
    return rec;
  });

  revalidatePath("/", "layout");
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: Request, { params }: { params: Promise<{ name: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { name } = await params;
  if (!isCol(name)) return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const item = await updateData((d: SiteData) => {
    const list = d[name] as Array<Record<string, unknown>>;
    const idx = list.findIndex((x) => x.id === body.id);
    if (idx === -1) return null;
    const next = { ...list[idx], ...body };
    if ((name === "categories" || name === "products" || name === "posts" || name === "pages") && next.slug) {
      next.slug = slugify(String(next.slug));
    }
    list[idx] = next;
    return next;
  });

  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/", "layout");
  return NextResponse.json(item);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ name: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { name } = await params;
  if (!isCol(name)) return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await updateData((d: SiteData) => {
    const list = d[name] as Array<Record<string, unknown>>;
    const idx = list.findIndex((x) => x.id === id);
    if (idx !== -1) list.splice(idx, 1);
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
