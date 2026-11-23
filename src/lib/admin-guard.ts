import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE, verifyToken } from "./auth";

export async function requireAdmin() {
  const c = await cookies();
  const payload = await verifyToken(c.get(COOKIE)?.value);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}
