import React from "react";
import VerificationEmail from "@/src/emails/VerificationEmail";
import { sendEmail } from "@/src/lib/email/send-email";


type VerificationEmailJobData = {
  email: string;
  otp: string;
};

export async function sendVerificationEmailJob({
  email,
  otp,
}: VerificationEmailJobData) {
  await sendEmail({
    to: email,
    subject: "Verify your VitaOS account",

    react: React.createElement(
      VerificationEmail,
      {
        otp,
      }
    ),
  });
}