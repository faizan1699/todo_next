import connect from "@/app/dbconfig/dbconfig";

import User from "@/app/models/usermodel";
import { NextResponse } from "next/server";

connect();

export async function POST(res) {
  try {
    const reqBody = await res.json();
    const { email } = reqBody;
    console.log(email);
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }
    const isverified = await user.isemailverified;
    let isemailverified;

    if (isverified) {
      return NextResponse.json(
        { isemailverified: false, success: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { isemailverified: true, success: true },
        { status: 403 }
      );
    }
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ message: error?.message }, { status: 500 });
  }
}
