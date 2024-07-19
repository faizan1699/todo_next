import connect from "@/app/dbconfig/dbconfig";
import User from "@/app/models/usermodel";
import ContactModel from "@/app/models/Contact";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { countMessageWord } from "@/app/utils/countwords/countwords";

// function countMessageWord(message) {
//   const wordRegex = /\b\w+\b/g;
//   const matches = message.match(wordRegex);
//   return matches ? matches.length : 0;
// }

export async function POST(req) {
  await connect();
  try {
    const reqbody = await req.json();
    const { name, email, message, contact } = reqbody;

    if (!email && !message && !name) {
      return NextResponse.json(
        { message: "name email and message required" },
        { status: 400 }
      );
    }
    if (!email) {
      return NextResponse.json({ message: "email required" }, { status: 422 });
    }
    if (name.length < 4) {
      return NextResponse.json(
        { message: "name must be 4 chracters" },
        { status: 422 }
      );
    }

    const checkMessageLength = countMessageWord(message);

    if (checkMessageLength < 5) {
      return NextResponse.json(
        { message: "message must be 5 words" },
        { status: 422 }
      );
    }
    if (contact && contact.length < 10) {
      return NextResponse.json(
        { message: "contact must be 10 numbers" },
        { status: 422 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "pls provide your registerd email" },
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
