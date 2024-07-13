import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async ({ email }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // or 587 for TLS
      secure: true,
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true,
    });

    transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Test Email",
        text: "Hello world!",
        html: "<b>Hello world!</b>",
      })
      .then((info) => {
        console.log("Message sent: %s", info.messageId);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
    console.log(`Email sent successfully to ${email}`);
  } catch (error) {
    console.log("Error sending email:", error);
  }
};

export default sendMail;
