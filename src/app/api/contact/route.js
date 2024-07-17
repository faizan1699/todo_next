import connect from "@/app/dbconfig/dbconfig";
import User from "@/app/models/usermodel";
import ContactModel from "@/app/models/Contact";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";

export async function POST(req) {
  await connect();
  try {
    const reqbody = await req.json();
    const { name, email, message, contact } = reqbody;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "you are not registerd pls register your account" },
        { status: 403 }
      );
    }

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentDateTime = DateTime.now().setZone(userTimezone);

    const contactData = new ContactModel({
      name: name,
      email: email,
      message: message,
      contact: contact,
      contactdate: currentDateTime.toJSDate(),
    });

    await contactData.save();

    const reponse = NextResponse.json({
      message: "contact details sent successfully",
      success: true,
      contactData,
    });
    return reponse;
  } catch (error) {
    return NextResponse.json({ message: error?.message }, { status: 500 });
    console.log(error);
  }
}
