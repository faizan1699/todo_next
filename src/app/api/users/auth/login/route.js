import connect from "@/app/dbconfig/dbconfig";
import User from "@/app/models/usermodel";
import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(req) {
  try {
    // verify jwt token is available
    const reqBody = await req.json();
    const { email, password } = reqBody;
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    if (user.isuserblock) {
      return NextResponse.json(
        { message: "your account is blocked" },
        { status: 403 }
      );
    }

    const isVerified = await user.isemailverified;
    if (isVerified === false) {
      return NextResponse.json(
        { message: "Email not verify , pls verify email first" },
        { status: 401 }
      );
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
      superAdmin: false,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "50d",
    });

    const userdata = {
      userId: user._id,
      username: user.username,
      email: user.email,
    };

    const response = NextResponse.json({
      message: "login successfully",
      success: true,
      userdata,
      token,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 10 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.log("login error", error);
    return NextResponse.json({ message: error.message });
  }
}
