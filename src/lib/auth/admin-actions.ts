"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_AUTH_COOKIE,
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
  getAdminSessionValue,
  hasAdminAuthConfig,
  isValidAdminCredentials,
} from "@/lib/auth/admin";

export async function loginAction(formData: FormData) {
  if (!hasAdminAuthConfig()) {
    redirect(`${ADMIN_LOGIN_PATH}?error=auth_not_configured`);
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!isValidAdminCredentials(email, password)) {
    redirect(`${ADMIN_LOGIN_PATH}?error=invalid_credentials`);
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_AUTH_COOKIE, getAdminSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  redirect(ADMIN_HOME_PATH);
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_AUTH_COOKIE);

  redirect(ADMIN_LOGIN_PATH);
}
