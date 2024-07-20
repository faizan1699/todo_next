import User from "@/app/models/usermodel";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const Adminemail = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const DOMAIN = process.env.DOMAIN;

export const sendOtpEmail = async ({ email, OTP }) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass,
      },
    });

    const mailOption = {
      from: Adminemail,
      to: user.email,
      subject: "Password reset OTP",
      html: `
          <div style="border: 2px solid #02187e; max-width: 600px; margin: auto; border-radius: 25px;">
        <div style="padding: 10px 0; background: #01125e; border-top-left-radius: 20px;border-top-right-radius: 20px;">
            <h4 style="text-align: center; font-size: 25px; color: aliceblue;">Reset Password OTP</h4>
        </div>
        <div style="margin: 20px 0; padding: 20px 10px;">
            <div>
                <h3 style="font-weight: bold; color: rgb(9, 1, 126)">We are Informed you</h3>
                <br>
                we recieved request for changing your password and your OTP is : <span
                    style="color: red; font-weight: bold; font-size: 24px;"> ${OTP}</span>
                <div style="margin-top: 20px;">
                    if you not request for changing password ignore this email or change your password for secure your
                    app account
                    <a style="color: rgb(0, 86, 143);" href="${DOMAIN}/password/forget">Click here to reset your
                        password</a>
                    <br>
                    or change your password <a style="color: rgb(0, 86, 143);"
                        href="${DOMAIN}/password/change">Click here to change your password</a>
                </div>
            </div>
        </div>
        <div style="padding: 40px; background: #01125e; border-bottom-left-radius: 20px;border-bottom-right-radius: 20px;"></div>
    </div>`,
    };

    await transporter.sendMail(mailOption);
  } catch (error) {
    console.error("Error sending otp email:", error);
    return NextResponse.json({ message: error?.message }, { status: 500 });
  }
};
