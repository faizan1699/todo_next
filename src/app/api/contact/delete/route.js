import User from "@/app/models/usermodel";
import connect from "@/app/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"; 
import ContactModel from "@/app/models/Contact";

connect();

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
      return NextResponse.json({ message: error.message }, { status: 401 });
    }

    const email = decodedToken.email;
    console.log("email" , email)
    const reqbody = await req.json();
    const { id } = reqbody;

    const user = await ContactModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: " user not found" }, { status: 404 });
    }

    const delmessage = await ContactModel.findOneAndDelete({email: user.email});

    if (!delmessage) {
      return NextResponse.json(
        {
          message: "message not found or not have permission to deleted",
        },
        { status: 404 }
      );
    }

    const todos = await ContactModel.find({ _id: user._id });

    const response = NextResponse.json({
      success: true,
      message: "Message Deleted Successfully",
      todos,
    });

    return response;
  } catch (error) {
    console.error("Error deleting message:", error.message);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
