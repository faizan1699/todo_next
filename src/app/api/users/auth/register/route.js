import connect from "@/app/dbconfig/dbconfig";

import User from "@/app/models/usermodel";
import sendMail from "@/app/utils/nodemailer/nodemailer";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
connect();

export async function POST(req) {
  try {
    const reqBody = await req.json();

    const { username, email, password } = reqBody;

    const userfind = await User.findOne({ email });

    if (userfind) {
      return NextResponse.json(
        { message: "User already exist" },
        { status: 403 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const saveduser = await newUser.save();

    sendMail({ email });

    return NextResponse.json(
      {
        message: "user registerd successfully",
        success: true,
        saveduser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("register error", error);
    return NextResponse.json({ message: error.message });
  }
}
