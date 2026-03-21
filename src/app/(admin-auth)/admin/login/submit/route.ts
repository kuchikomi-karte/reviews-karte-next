import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_AUTH_COOKIE,
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
  getAdminSessionValue,
  hasAdminAuthConfig,
  isValidAdminCredentials,
} from "@/lib/auth/admin";

export async function POST(request: Request) {
  if (!hasAdminAuthConfig()) {
    return NextResponse.redirect(
      new URL(`${ADMIN_LOGIN_PATH}?error=auth_not_configured`, request.url),
      303,
    );
  }

  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!isValidAdminCredentials(email, password)) {
    return NextResponse.redirect(
      new URL(`${ADMIN_LOGIN_PATH}?error=invalid_credentials`, request.url),
      303,
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_AUTH_COOKIE, getAdminSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return NextResponse.redirect(new URL(ADMIN_HOME_PATH, request.url), 303);
}
