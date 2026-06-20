import { NextResponse } from "next/server";

export async function proxy(request) {
    const sessionToken = request.cookies.get("better-auth.session_token");

    
    if (!sessionToken) {
        return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
    
    matcher: ["/dashboard/:path*"]
}