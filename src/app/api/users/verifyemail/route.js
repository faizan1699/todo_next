import connect from "@/app/dbconfig/dbconfig";
import User from "@/app/models/usermodel";
import { DateTime } from "luxon";
import { NextResponse } from "next/server";

// Establish a connection to the database
connect();

export async function POST(req, res) {
  try {
    const reqBody = await req.json();
    const { token } = reqBody;

    const user = await User.findOne({
      verifyemailtoken: token,
      verifyemailtokenexpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentDateTime = DateTime.now().setZone(userTimezone);

    user.isemailverified = true;
    user.verifyemailtoken = undefined;
    user.verifyemailtokenexpiry = undefined;
    user.userverificationDate = currentDateTime.toJSDate();

    await user.save();

    return NextResponse.json(
      {
        message: "Email verified successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during email verification:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
