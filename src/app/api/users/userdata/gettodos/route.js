import User from "@/app/models/usermodel";
import connect from "@/app/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import TodoModel from "@/app/models/todomodel";
import jwt from "jsonwebtoken"; // Make sure to import jwt library

connect();

export async function GET(req) {
  try {
    await connect();

    const token = req.cookies.get("token");
    const tokenValue = token && typeof token === "object" ? token.value : token;

    if (!tokenValue) {
      return NextResponse.json(
        { message: "JWT token is missing" },
        { status: 401 }
      );
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(tokenValue, process.env.JWT_SECRET);
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      return NextResponse.json(
        { message: "Invalid JWT token" },
        { status: 401 }
      );
    }

    const email = decodedToken.email;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Find todos associated with the user
    const todos = await TodoModel.find({ user: user._id });

    // Return todos as JSON response
    return NextResponse.json({
      success: true,
      todos,
    });
  } catch (error) {
    console.error("Error fetching todos:", error.message);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const token = req.cookies.get("token");
    const tokenvalue = token && typeof token === "object" ? token.value : token;
    if (!tokenvalue) {
      return NextResponse.json(
        { message: "jwt token not found" },
        { status: 401 }
      );
    }

    let decodedToken;

    try {
      decodedToken = jwt.verify(tokenvalue, process.env.JWT_SECRET);
    } catch (error) {
      console.log(error.message);
      return NextResponse.json({ message: "token not found" }, { status: 401 });
    }

    const email = decodedToken.email;
    const reqbody = await req.json();
    const { id } = reqbody;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: " user not found" }, { status: 404 });
    }

    const deletedTodo = await TodoModel.findOneAndDelete({
      _id: id,
      user: user._id,
    });

    if (!deletedTodo) {
      return NextResponse.json(
        {
          message: "todo not found or not have permission to deleted",
        },
        { status: 404 }
      );
    }

    const todos = await TodoModel.find({ user: user._id });

    const response = NextResponse.json({
      success: true,
      message: "Todo Deleted Successfully",
      todos,
    });

    return response;
  } catch (error) {
    console.error("Error deleting todo:", error.message);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
