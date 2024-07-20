import connect from "@/app/dbconfig/dbconfig";
import User from "@/app/models/usermodel";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import jwt from "jsonwebtoken";


connect();

async function getUserToken(req) {
  const tokenCookie = req.cookies.get("token");

  const token =
    tokenCookie && typeof tokenCookie === "object"
      ? tokenCookie.value
      : tokenCookie;

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 403 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }

  return decoded;
}

export async function POST(req) {
  try {
    const reqbody = await req.json();
    const { email } = reqbody;
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "user not found" });
    }
    const isAdmin = (await user.isAdmin) || user.isSuperAdmin;
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
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const reqbody = await req.json();
    const { id } = reqbody;

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: "user not found" });
    }

    const superAdmin = await user.isSuperAdmin;

    if (superAdmin) {
      return NextResponse.json(
        { message: "not have permission to delete super admin" },
        { status: 403 }
      );
    }

    const deleteuser = await User.findByIdAndDelete(id);

    if (!deleteuser) {
      return NextResponse.json({ message: "user not delete" });
    }

    const response = NextResponse.json(
      {
        message: "user deleted successfully",
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

export async function PUT(req) {
  try {
    const token = await getUserToken(req);
    console.log("token from jwt file", token.email);
    const reqbody = await req.json();
    const {
      id,
      email,
      username,
      isemailverified,
      isAdmin,
      updatedby,
      isSuperAdmin,
    } = reqbody;

    const editeremail = token.email;
    console.log(editeremail);
    const editer = await User.findOne({ email: editeremail });

    const idEditersuperAdmin = await editer.isSuperAdmin;

    console.log("isSuperAdmin", idEditersuperAdmin);
    const user = await User.findById({ _id: id });

    if (!user) {
      return NextResponse.json({
        message: "user not found",
      });
    }

    if (!idEditersuperAdmin) {
      const superAdmin = await user.isSuperAdmin;
      if (superAdmin) {
        return NextResponse.json(
          { message: "not have permission to edit super admin" },
          { status: 403 }
        );
      }
    }

    const Admin = await User.findOne({ email: updatedby });
    if (!Admin) {
      return NextResponse.json(
        {
          message: "only admin authorized",
        },
        { status: 401 }
      );
    }

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentDateTime = DateTime.now().setZone(userTimezone);

    user.email = email;
    user.username = username;
    user.isemailverified = isemailverified;
    user.isAdmin = isAdmin;
    user.userUpdatedby = updatedby;
    user.userUpdatedOn = currentDateTime.toJSDate();

    if (typeof isSuperAdmin !== "undefined") {
      user.isSuperAdmin = isSuperAdmin;
    } else {
    }

    await user.save();

    const usersdata = {
      id,
      email,
      isAdmin: isAdmin,
      username,
      isemailverified: isemailverified,
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

    return response;
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
