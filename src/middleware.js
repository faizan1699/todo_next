import { NextResponse } from "next/server";

// Middleware function to handle authentication and redirection
export function middleware(request) {
  // Retrieve the token from cookies
  const token = request.cookies.get("token")?.value;
  const reqpath = request.nextUrl.pathname;
  // Define paths that should not be accessible if the user is already logged in
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
    console.log("token not found");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    console.log("Invalid token:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Define the paths that the middleware should apply to
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
