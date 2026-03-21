import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  USER_HOME_PATH,
  USER_LOGIN_PATH,
  USER_REGISTER_PATH,
  toLoggableAuthError,
} from "@/lib/auth/user";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const providerError = requestUrl.searchParams.get("error");
  const providerErrorDescription =
    requestUrl.searchParams.get("error_description");
  const flow = requestUrl.searchParams.get("flow");
  const failurePath =
    flow === "register" ? USER_REGISTER_PATH : USER_LOGIN_PATH;

  if (!code || providerError) {
    console.error("[auth/callback] Missing code or provider returned an error", {
      providerError,
      providerErrorDescription,
      url: request.url,
    });
    return redirectWithAuthError(requestUrl, failurePath);
  }

  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore,
    });
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("[auth/callback] Failed to exchange code for session", {
      error: toLoggableAuthError(error),
      url: request.url,
    });
    return redirectWithAuthError(requestUrl, failurePath);
  }

  return NextResponse.redirect(`${requestUrl.origin}${USER_HOME_PATH}`);
}

function redirectWithAuthError(requestUrl: URL, pathname: string) {
  const redirectUrl = new URL(pathname, requestUrl.origin);
  redirectUrl.searchParams.set("authError", "google_callback_failed");
  return NextResponse.redirect(redirectUrl);
}
