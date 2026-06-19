import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";
  
export async function middleware(request) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(session){
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
}

export const config = {
    matcher: ["/dashboard/:path"]
}