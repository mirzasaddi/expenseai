// src/app/api/admin/login/route.ts
import { NextResponse } from "next/server";

const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const res = NextResponse.json({ success: true });

    // HttpOnly cookie so JS can't read it (more secure)
    res.cookies.set("admin_auth", "1", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 1 hour
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  }

  return NextResponse.json(
    { error: "Invalid username or password" },
    { status: 401 }
  );
}
