
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  if (url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
