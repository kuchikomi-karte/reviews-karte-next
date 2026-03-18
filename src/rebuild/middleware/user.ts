import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  USER_LOGIN_PATH,
  hasUserAuthConfig,
  isUserProtectedPath,
} from "@/lib/auth/user";

export async function handleUserMiddleware(
  request: NextRequest,
): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;

  if (!isUserProtectedPath(pathname)) {
    return null;
  }

  if (!hasUserAuthConfig()) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL(USER_LOGIN_PATH, request.url));
  }

  return response;
}
