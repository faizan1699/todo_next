import User from "@/app/models/usermodel";
import connect from "@/app/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import TodoModel from "@/app/models/todomodel";
import { DateTime } from "luxon";
import { countMessageWord } from "@/app/utils/countwords/countwords";

export async function POST(req) {
  await connect();
  try {
    const reqbody = await req.json();
    const { email, title, description, iscompleted } = reqbody;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "user not found" });
    }

    const countTitle = countMessageWord(title);
    const countdescription = countMessageWord(description);

    if (countTitle < 4) {
      return NextResponse.json(
        { message: "title must be 4 chracter" },
        { status: 422 }
      );
    }
    if (countdescription < 10) {
      return NextResponse.json(
        { message: "description must be 10 words" },
        { status: 422 }
      );
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

export async function PUT(req) {
  await connect();
  try {
    const reqbody = await req.json();
    const { id, title, description, iscompleted } = reqbody;
    const todo = await TodoModel.findById(id);

    if (!todo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    const countTitle = countMessageWord(title);
    const countdescription = countMessageWord(description);

    if (countTitle < 4) {
      return NextResponse.json(
        { message: "title must be 4 chracter" },
        { status: 422 }
      );
    }
    if (countdescription < 10) {
      return NextResponse.json(
        { message: "description must be 10 words" },
        { status: 422 }
      );
    }

    // Update todo fields
    todo.title = title;
    todo.description = description; // Corrected typo here
    todo.iscompleted = iscompleted;

    // Update updatedat timestamp
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentDateTime = DateTime.now().setZone(userTimezone);
    todo.updatedat = currentDateTime.toJSDate();

    // Save the updated todo
    await todo.save();
    const todos = {
      title,
      description,
      iscompleted,
      createdat: "null",
      updatedat: currentDateTime.toJSDate(),
    };

    const response = NextResponse.json({
      message: "todo Updated successfully",
      success: true,
      todos,
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
