import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function getUserToken(req) {
  const tokenCookie = req.cookies.get("token");

  const token =
    tokenCookie && typeof tokenCookie === "object"
      ? tokenCookie.value
      : tokenCookie;

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 403 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }

  return decoded;
}
