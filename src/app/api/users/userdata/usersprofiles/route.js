import connect from "@/app/dbconfig/dbconfig";
import User from "@/app/models/usermodel";
import { NextResponse } from "next/server";

export default async function GET(req) {
  try {
    await connect();

    const users = await User.find();

    if (!users) {
      return NextResponse.json({ message: "users not fetched" });
    }

    const response = NextResponse.json(
      {
        message: "All users profile fetched successfully",
        success: true,
        users,
      },
      { status: 200 }
    );

    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
