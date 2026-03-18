import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  ADMIN_AUTH_COOKIE,
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
  isAdminAuthenticated,
} from "@/lib/auth/admin";

function isAdminProtectedPath(pathname: string): boolean {
  return pathname === ADMIN_HOME_PATH || pathname.startsWith(`${ADMIN_HOME_PATH}/`);
}

export function handleAdminMiddleware(
  request: NextRequest,
): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return null;
  }

  const isLoggedIn = isAdminAuthenticated(
    request.cookies.get(ADMIN_AUTH_COOKIE)?.value,
  );

  if (pathname === ADMIN_LOGIN_PATH || pathname.startsWith(`${ADMIN_LOGIN_PATH}/`)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(ADMIN_HOME_PATH, request.url));
    }

    return NextResponse.next();
  }

  if (isAdminProtectedPath(pathname) && !isLoggedIn) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}
