import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnHomepage = req.nextUrl.pathname === "/";

  if (isLoggedIn && isOnHomepage) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/"],
};