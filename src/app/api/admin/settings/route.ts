import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateData } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function PUT(req: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const body = await req.json();
  const saved = await updateData((d) => {
    d.settings = { ...d.settings, ...body };
    return d.settings;
  });
  revalidatePath("/", "layout");
  return NextResponse.json(saved);
}
