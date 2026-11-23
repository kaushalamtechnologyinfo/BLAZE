import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "bt_admin";

function secret() {
  return new TextEncoder().encode(process.env.ADMIN_SECRET || "change-this-secret-in-production-please");
}

export async function createToken(user: string) {
  return new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifyToken(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as { user: string };
  } catch {
    return null;
  }
}

export function checkCredentials(user: string, pass: string) {
  const U = process.env.ADMIN_USER || "admin";
  const P = process.env.ADMIN_PASSWORD || "admin123";
  return user === U && pass === P;
}
