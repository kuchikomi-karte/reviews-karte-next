"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_AUTH_COOKIE,
  getAdminSessionValue,
  hasAdminAuthConfig,
  isValidAdminCredentials,
} from "@/lib/admin-auth";

export async function loginAction(formData: FormData) {
  if (!hasAdminAuthConfig()) {
    redirect("/login?error=auth_not_configured");
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!isValidAdminCredentials(email, password)) {
    redirect("/login?error=invalid_credentials");
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_AUTH_COOKIE, getAdminSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_AUTH_COOKIE);

  redirect("/login");
}
