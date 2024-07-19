import { NextResponse } from "next/server";

// Middleware function to handle authentication and redirection
export function middleware(request) {
  // Retrieve the token from cookies
  const token = request.cookies.get("token")?.value;

  // Define paths that should not be accessible if the user is already logged in
  const isUserLoginNotAccess =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup";

  // If the user tries to access login or signup and is already authenticated, redirect to home page
  if (isUserLoginNotAccess) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Allow access to login or signup if the user is not authenticated
    return NextResponse.next();
  }

  // If no token is present and the user tries to access protected routes, redirect to login page
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

  // Allow access to the protected route if the token is valid
  return NextResponse.next();
}

// Define the paths that the middleware should apply to
export const config = {
  matcher: [
    "/admin/:path*",
    "/createtodo",
    "/todos",
    "/changepassword",
    "/contact",
    "/signup",
    "/login",
  ],
};
