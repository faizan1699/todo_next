import connect from "@/app/dbconfig/dbconfig";
import User from "@/app/models/usermodel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function POST(req) {
  try {
    const reqbody = await req.json();
    const { email } = reqbody;

    const token = req.cookies.get("token");
    const jwtToken = token && typeof token === "object" ? token.value : token;

    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    const currentTime = Math.floor(Date.now() / 100000);

    if (jwtToken) {
      if (decoded.exp && currentTime <= decoded.exp) {
        if (email === decoded.email) {
          return NextResponse.json(
            { message: "User already logged in", user: decoded.email },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            { message: "email not found" },
            { status: 403 }
          );
        }
      } else {
        return NextResponse.json({ message: "Token expired" }, { status: 401 });
      }
    }

    const response = NextResponse.json({ message: "Already logged in" });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
