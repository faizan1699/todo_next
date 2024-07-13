import connect from "@/app/dbconfig/dbconfig";
import User from "@/app/models/usermodel";
import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(req) {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({
        message: "user not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "invalid password" },
        { status: 401 }
      );
    }

    const tokenData = {
      userId: user._id,
      username: user.username,
      email: user.email,
      admin: user.isAdmin,
    };
    
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    
    const userdata = {
      userId: user._id,
      username: user.username,
      email: user.email,
      admin: user.isAdmin,
    };

    const response = NextResponse.json({
      message: "login successfully",
      success: true,
      userdata,
      token
    });

    await response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 10 * 24 * 60 * 60, 
    });

    return response;
  } catch (error) {
    console.log("login error", error);
    return NextResponse.json({ message: error.message });
  }
}
