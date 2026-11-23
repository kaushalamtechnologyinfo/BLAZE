import { NextResponse } from "next/server";
import { getData } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const data = await getData();
  return NextResponse.json(data);
}
