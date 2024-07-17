import connect from "@/app/dbconfig/dbconfig";
import User from "@/app/models/usermodel";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";

connect();

export async function PUT(req) {
  try {
    const reqbody = await req.json(); // Parse request body
    const { id } = reqbody;

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({
        message: "user not found associated with this id",
      });
    }

    user.isuserblock = false;
    user.blockon = undefined;

    await user.save();

    const response = NextResponse.json(
      {
        message: "user blocked successfully",
        success: true,
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
