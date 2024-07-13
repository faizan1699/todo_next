import connect from "@/app/dbconfig/dbconfig";
import User from "@/app/models/usermodel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connect();

    const reqBody = await req.json();
    const { email } = reqBody;
    const user = await User.findOne({ email: email });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const isAdmin = user.isAdmin;

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
