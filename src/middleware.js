import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";

export function middleware(request, res) {
  const x = request.cookies.get("token");
  const token = x && typeof x === "object" ? x.value : x;
  const reqpath = request.nextUrl.pathname;

  const isUserLoginNotAccess =
    reqpath === "/login" ||
    reqpath === "/signup" ||
    reqpath === "/password/forget";

  if (isUserLoginNotAccess) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
     JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    console.log("Invalid token:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/createtodo",
    "/todos",
    "/password/change",
    "/contact",
    "/signup",
    "/login",
    "/password/forget",
  ],
};
