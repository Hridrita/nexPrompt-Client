import { betterFetch } from "@better-fetch/fetch";
import { NextResponse } from "next/server";

export async function proxy(request) {
  const { data: session } = await betterFetch("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  const { pathname } = request.nextUrl;

  if (!session) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  const role = session.user?.role?.toLowerCase();

  const roleRoutes = {
    admin: "/dashboard/admin",
    creator: "/dashboard/creator",
    user: "/dashboard/user",
  };

  const allowedBase = roleRoutes[role];

  if (allowedBase && !pathname.startsWith(allowedBase)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};