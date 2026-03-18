import { parseSupabaseCookie } from "@supabase/auth-helpers-shared";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { USER_LOGIN_PATH, hasUserAuthConfig } from "@/lib/auth/user";

function readSessionFromCookies(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const authCookie = cookieStore
    .getAll()
    .find(
      (cookie) =>
        cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"),
    );

  if (!authCookie) {
    return null;
  }

  if (authCookie.name.includes(".0")) {
    const baseName = authCookie.name.replace(/\.0$/, "");
    const chunks: string[] = [];

    for (let index = 0; ; index += 1) {
      const chunk = cookieStore.get(`${baseName}.${index}`)?.value;

      if (!chunk) {
        break;
      }

      chunks.push(chunk);
    }

    return parseSupabaseCookie(chunks.join(""));
  }

  return parseSupabaseCookie(authCookie.value);
}

export async function requireUserSession() {
  if (!hasUserAuthConfig()) {
    return;
  }

  const cookieStore = await cookies();
  const session = readSessionFromCookies(cookieStore);

  if (!session) {
    redirect(USER_LOGIN_PATH);
  }
}
