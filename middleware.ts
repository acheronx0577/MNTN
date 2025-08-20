import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PB_COOKIE = "pb_auth";

function isAuthenticated(request: NextRequest) {
  const cookie = request.cookies.get(PB_COOKIE);
  return Boolean(cookie?.value && cookie.value.length > 10);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = isAuthenticated(request);

  if (pathname.startsWith("/account") && !authed) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if ((pathname === "/login" || pathname === "/signup") && authed) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/login", "/signup"],
};
