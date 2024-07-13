import User from "@/app/models/usermodel";
import connect from "@/app/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import TodoModel from "@/app/models/todomodel";
import { DateTime } from "luxon";

export async function POST(req) {
  await connect();
  try {
    const reqbody = await req.json();
    const { email, title, description, iscompleted } = reqbody;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "user not found" });
    }

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentDateTime = DateTime.now().setZone(userTimezone);

    const newTodo = new TodoModel({
      title,
      description,
      iscompleted,
      user: user._id,
      createdat: currentDateTime.toJSDate(),
      updatedat: currentDateTime.toJSDate(),
    });

    await newTodo.save();

    const saved_data = {
      title,
      description,
      iscompleted,
      createdat: currentDateTime.toJSDate(),
      updatedat: currentDateTime.toJSDate(),
    };

    const response = NextResponse.json({
      message: "todo saved successfully",
      success: true,
      saved_data,
    });

    return response;

  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
