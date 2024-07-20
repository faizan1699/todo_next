
import User from "@/app/models/usermodel";
import connect from "@/app/dbconfig/dbconfig";

import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function PUT(req) {

  await connect();
  
  try {
    const token = req.cookies.get("token");
    const tokenValue = token && typeof token === "object" ? token.value : token;

    if (!tokenValue) {
      return NextResponse.json({ message: "token not found" }, { status: 401 });
    }

    const currentTime = Math.floor(Date.now() / 1000);
    let decoded;

    try {
      decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { message: "Token verification failed" },
        { status: 401 }
      );
    }

    if (decoded.exp && decoded.exp <= currentTime) {
      return NextResponse.json({ message: "session expired" }, { status: 401 });
    }

    const useremail = decoded.email;

    const reqBody = await req.json();
    const { password, newpassword } = reqBody;

    const user = await User.findOne({ email: useremail });

    if (newpassword === password) {
      return NextResponse.json(
        { message: "pls use different password from old password" },
        { status: 422 }
      );
    }

    if (newpassword.length < 8) {
      return NextResponse.json(
        { message: "new pasword must be 8 chracters" },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          message: "user not found",
        },
        { status: 400 }
      );
    }
    const checkPassword = await bcrypt.compare(password, user.password); // Changed line: Added `await` to `bcrypt.compare`
    if (!checkPassword) {
      return NextResponse.json({ message: "Wrong password" }, { status: 400 });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(newpassword, salt);

    user.password = hashedpassword;
    await user.save();

    return NextResponse.json({
      message: "password updated successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ message: error?.message }, { status: 500 });
  }
}
