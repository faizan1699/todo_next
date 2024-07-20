import connect from "@/app/dbconfig/dbconfig";
import User from "@/app/models/usermodel";
import crypto from "crypto";
import bcrypt from "bcryptjs";

import { DateTime } from "luxon";
import { NextResponse } from "next/server";
import { sendOtpEmail } from "@/app/utils/nodemailer/resetPasswordemail";

connect();

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const currentDateTime = DateTime.now().setZone(userTimezone);

export async function POST(req) {
  try {
    const reqBody = await req.json();
    const { email } = reqBody;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    function generateRandomCode() {
      const min = 100000;
      const max = 999999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const OTP = generateRandomCode();

    const expiryToken = crypto.randomBytes(40).toString("hex");
    const expiryDateTime = currentDateTime.plus({ hours: 1 }).toJSDate();

    user.otp = OTP;
    user.forgetpasswordtoken = expiryToken;
    user.forgetpasswordexpiry = expiryDateTime;

    await user.save();

    try {
      sendOtpEmail({ email, OTP });
    } catch (error) {
      return NextResponse.json({ message: error.message }, { status: 424 });
    }

    const response = NextResponse.json(
      {
        message: "password reset OTp sent to your email",
        success: true,
      },
      { status: 200 }
    );
    return response;
  } catch (error) {
    console.log("resetPassword error", error.message);

    return NextResponse.json({ message: error?.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const n = await req.json();
    const { otp, password, email } = n;

    if (otp.length !== 6) {
      return NextResponse.json(
        { message: "OTP must be 6 chracters" },
        { status: 422 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "new password must be 8 chracters" },
        { status: 422 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    const checkOTP = await User.findOne({
      email: email,
      otp: otp,
    });

    if (!checkOTP) {
      return NextResponse.json({ message: "invalid otp" }, { status: 400 });
    }

    const currentTime = currentDateTime.toJSDate();
    const forgetpasswordexpiry = user.forgetpasswordexpiry;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (currentTime > forgetpasswordexpiry) {
      return NextResponse.json(
        { message: "OTP expired pls get new otp" },
        { status: 403 }
      );
    }

    user.otp = undefined;
    user.forgetpasswordtoken = undefined;
    user.forgetpasswordexpiry = undefined;
    user.password = hashedPassword;

    await user.save();

    const repsonse = NextResponse.json({
      message: "Password Updated Successfully",
      success: true,
    });

    return repsonse;
  } catch (error) {
    console.log("resetPassword error", error.message);

    return NextResponse.json({ message: error?.message }, { status: 500 });
  }
}
