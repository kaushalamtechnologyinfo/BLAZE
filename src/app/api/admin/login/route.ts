import { NextResponse } from "next/server";
import { checkCredentials, COOKIE, createToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { username = "", password = "" } = await req.json().catch(() => ({}));
  if (!checkCredentials(String(username).trim(), String(password))) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }
  const token = await createToken(String(username).trim());
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
