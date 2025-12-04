// src/app/api/admin/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // Clear the cookie
  res.cookies.set("admin_auth", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
