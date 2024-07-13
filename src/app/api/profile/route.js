import User from "@/app/models/usermodel";
import connect from "@/app/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connect();

    const token = req.cookies.get("token");
    const tokenValue = token && typeof token === "object" ? token.value : token;

    if (!tokenValue) {
      const errorMessage = { message: "JWT token is missing" };
      return NextResponse.json(errorMessage, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(tokenValue, process.env.JWT_SECRET);
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      return NextResponse.json(
        { message: "Invalid JWT token" },
        { status: 401 }
      );
    }

    const cookiemail = decodedToken.email;

    const user = await User.findOne({ email: cookiemail });

    if (!user) {
      return NextResponse.json({
        message: "user data not found",
      });
    }

    const userData = {
      username: user.username,
      email: user.email,
      id: user._id
    };

    const response = await NextResponse.json({ userData }, { status: 200 });
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
