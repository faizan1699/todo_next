import connect from "@/app/dbconfig/dbconfig";
import User from "@/app/models/usermodel";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";

connect();

export async function POST(req) {
  try {
    const reqbody = await req.json();
    const { email } = reqbody;
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "user not found" });
    }
    const isAdmin = await user.isAdmin;
    if (!isAdmin) {
      return NextResponse.json({
        message: "user not authencated for this page",
      });
    }
    const usersdata = await User.find();
    if (!usersdata) {
      return NextResponse.json({ message: "users data not fetched" });
    }
    const response = NextResponse.json(
      {
        message: "All users profile fetched successfully",
        success: true,
        usersdata,
      },
      { status: 200 }
    );
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const reqbody = await req.json();
    const { id, email, useremail, username, emailverify, isadmin, updatedby } =
      reqbody;
    console.log(id);
    console.log(useremail);

    const isuser = await User.findOne({ useremail });

    if (isuser) {
      return NextResponse.json({
        message: "user found",
      });
    }
    // const isAdmin = await User.isAdmin;
    // if (!isAdmin) {
    //   return NextResponse.json({
    //     message: "only admin authorized",
    //   });
    // }

    const user = await User.findById(id);

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentDateTime = DateTime.now().setZone(userTimezone);

    user.email = email;
    user.username = username;
    user.isemailverified = emailverify;
    user.isAdmin = isadmin;
    user.userUpdatedby = updatedby;
    user.userUpdatedOn = currentDateTime.toJSDate();

    await user.save();

    const usersdata = {
      id,
      email,
      isAdmin: isadmin,
      username,
      isemailverified: emailverify,
      userUpdatedOn: currentDateTime.toJSDate(),
      userUpdatedby: updatedby,
    };

    const response = NextResponse.json(
      {
        message: "user updated successfully",
        success: true,
        usersdata,
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
