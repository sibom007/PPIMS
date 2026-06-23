import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const authRoutes = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
];

const protectedRoutes = ["/dashboard"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const sessionCookie = getSessionCookie(request);

  const isLoggedIn = !!sessionCookie;

  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  /**
   * logged user can't access auth pages
   */
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  /**
   * guest can't access protected pages
   */
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};