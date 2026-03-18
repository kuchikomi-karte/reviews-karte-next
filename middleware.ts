import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { handleAdminMiddleware } from "@/rebuild/middleware/admin";
import { handleUserMiddleware } from "@/rebuild/middleware/user";

export async function middleware(request: NextRequest) {
  const adminResponse = handleAdminMiddleware(request);

  if (adminResponse) {
    return adminResponse;
  }

  const userResponse = await handleUserMiddleware(request);

  if (userResponse) {
    return userResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/premium", "/admin/:path*"],
};
