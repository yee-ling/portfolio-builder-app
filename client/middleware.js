import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded.data.isAdmin) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
  runtime: "nodejs",
};
