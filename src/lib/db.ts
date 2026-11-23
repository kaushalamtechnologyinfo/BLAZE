import { promises as fs } from "fs";
import path from "path";
import type { SiteData } from "./types";

const FILE = path.join(process.cwd(), "data", "site.json");
const SB_URL = () => (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const SB_KEY = () => process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let queue: Promise<unknown> = Promise.resolve();

function sbHeaders(extra?: Record<string, string>) {
  const key = SB_KEY();
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function readLocal(): Promise<SiteData> {
  const raw = await fs.readFile(FILE, "utf8");
  return JSON.parse(raw) as SiteData;
}

async function saveSupabase(data: SiteData) {
  const r = await fetch(`${SB_URL()}/rest/v1/site_data`, {
    method: "POST",
    headers: sbHeaders({ Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify({ id: "main", data, updated_at: new Date().toISOString() }),
    cache: "no-store",
  });
  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    throw new Error(`Supabase save failed (${r.status}): ${txt}`);
  }
}

export async function getData(): Promise<SiteData> {
  if (SB_URL() && SB_KEY()) {
    try {
      const r = await fetch(`${SB_URL()}/rest/v1/site_data?id=eq.main&select=data`, {
        headers: sbHeaders(),
        cache: "no-store",
      });
      if (r.ok) {
        const rows = (await r.json()) as { data: SiteData }[];
        if (rows?.[0]?.data) return rows[0].data;
        // Table exists but empty — auto-seed from bundled site.json
        const seed = await readLocal();
        await saveSupabase(seed).catch(() => undefined);
        return seed;
      }
    } catch {
      // fall back to local seed if network temporarily fails
    }
  }
  return readLocal();
}

/** Serialised read-modify-write so concurrent admin saves never clobber each other. */
export function updateData<T>(fn: (d: SiteData) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const data = await getData();
    const result = await fn(data);
    if (SB_URL() && SB_KEY()) {
      await saveSupabase(data);
    } else {
      const tmp = FILE + ".tmp";
      await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
      await fs.rename(tmp, FILE);
    }
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

export async function getSettings() {
  return (await getData()).settings;
}
