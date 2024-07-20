import User from "@/app/models/usermodel";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";

const email = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const DOMAIN = process.env.DOMAIN;

export const sendMailVerification = async ({ useremail }) => {
  try {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tokenExpiry = DateTime.now().setZone(userTimezone).plus({ hours: 2 });

    const hashedToken = await bcrypt.hash(useremail.toString(), 10);

    const updateFields = {
      verifyemailtoken: hashedToken,
      verifyemailtokenexpiry: tokenExpiry.toJSDate(),
    };

    const user = await User.findOne({ email: useremail });

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    Object.assign(user, updateFields);
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass,
      },
    });

    const mailOption = {
      from: email,
      to: useremail,
      subject: "verify your email",
      html: `
         <div style="width: 75%; background-color: rgb(214, 230, 214); padding: 50px 10px; margin: 20px auto; border-radius: 20px;">
          <div style="display:flex; justify-content-center">
              <a style="display: flex; justify-content: center; background-color: rgb(10, 10, 10); color: white; text-decoration: none; padding: 10px 10%; width: 300px; border-radius: 10px;" href="${DOMAIN}/verifyemail?token=${hashedToken}">
               Click here to verify email</a>
          </div>
        <p style="font-family: Arial, sans-serif; font-size: 20px; line-height: 1.5; color: #630000;">
          To verify your email, copy and paste the link below in your browser.
          <br>
          <span style="font-size: 14px; padding: 0 auto; color: #0b0b92e8;">${DOMAIN}/verifyemail?token=${hashedToken}</span>
        </p>
      </div>`,
    };

    await transporter.sendMail(mailOption);
    console.log(`Verification email sent to ${useremail}`);
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "A server error occurred" },
      { status: 500 }
    );
  }
};
