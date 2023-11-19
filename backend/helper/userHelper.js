import asyncHandler from "express-async-handler";
import nodeMailer from "nodemailer";
import User from "../models/userModel.js";

//verifyMail//otpgenerate
const sendVerificationMailHelper = asyncHandler(async (name, email, otp) => {
  console.log(name, email, otp, "hello");
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_APP,
    to: email,
    subject: "EDEN OTP verification mail",
    html:
      "<p>Hello " +
      name +
      ", " +
      "this is your verify opt " +
      "  " +
      otp +
      ' "</p>',
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email has been sent:-", info.response);
    }
  });
});

const registerUserHelper = asyncHandler(
  async (name, email, password, oAuthLogin) => {
    if (oAuthLogin) {
      return await User.create({ name, email, oAuthLogin }, { upsert: true });
    } else {
      return await User.create({ name, email, password });
    }
  }
);



export { sendVerificationMailHelper, registerUserHelper };
