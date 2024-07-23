import connect from "@/app/dbconfig/dbconfig";

import User from "@/app/models/usermodel";
import { NextResponse } from "next/server";
import { sendMailVerification } from "@/app/utils/nodemailer/verifyemail";

connect();

export async function POST(res) {
 
  try {
 
    const reqBody = await res.json();
    const { email } = reqBody;


    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    try {
      sendMailVerification({ useremail: email });
    } catch (error) {
      return NextResponse.json({ message: error?.message }, { status: 424 });
    }

    const response = NextResponse.json({
      message: "Verification email sent successfully",
      success: true,
    });

    return response;

  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ message: error?.message }, { status: 500 });
  }
}
