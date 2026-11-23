import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { requireAdmin } from "@/lib/admin-guard";
import { uid } from "@/lib/utils";

const ALLOWED_FOLDERS = new Set(["products", "posts", "gallery", "pages", "site"]);
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".mp4", ".webm"]);

export async function POST(req: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const form = await req.formData();
  const file = form.get("file");
  const folderRaw = String(form.get("folder") || "site");
  const folder = ALLOWED_FOLDERS.has(folderRaw) ? folderRaw : "site";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const filename = `${uid()}${ext}`;

  const sbUrl = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (sbUrl && sbKey) {
    const objectPath = `${folder}/${filename}`;
    const r = await fetch(`${sbUrl}/storage/v1/object/uploads/${objectPath}`, {
      method: "POST",
      headers: {
        apikey: sbKey,
        Authorization: `Bearer ${sbKey}`,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "true",
      },
      body: bytes,
    });
    if (!r.ok) {
      const err = await r.text().catch(() => "");
      return NextResponse.json({ error: `Storage upload failed: ${err}` }, { status: 500 });
    }
    return NextResponse.json({ url: `${sbUrl}/storage/v1/object/public/uploads/${objectPath}` });
  }

  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), bytes);

  return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
}
