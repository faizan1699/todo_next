import connect from "@/app/dbconfig/dbconfig";

import User from "@/app/models/usermodel";
import { sendMailVerification } from "@/app/utils/nodemailer/verifyemail";

import bcryptjs from "bcryptjs";

import { NextResponse } from "next/server";

connect();

export async function POST(req) {
  try {
    const reqBody = await req.json();

    const { username, email, password, profileimg } = reqBody;
    // if (!profileimg) {
    //   return NextResponse.json(
    //     { message: "pls upload your profile img" },
    //     { status: 400 }
    //   );
    // }
  
    if (username.length > 18) {
      return NextResponse.json(
        { message: "Username must be less then 18 character" },
        { status: 400 }
      );
    }

   

    if (password.length <= 7) {
      return NextResponse.json(
        { message: "password must be 8 chracters" },
        { status: 400 }
      );
    }

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
      profileimg,
    });

    const saveduser = await newUser.save();

    try {
      sendMailVerification({ useremail: email });
    } catch (error) {
      return NextResponse.json({ message: error.message }, { status: 424 });
    }

    return NextResponse.json(
      {
        message:
          "user registerd and an verification email sent check your email",
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
