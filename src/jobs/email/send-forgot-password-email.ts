import React from "react";

import ForgotPasswordEmail from "@/src/emails/ForgotPasswordEmail";
import { sendEmail } from "@/src/lib/email/send-email";



type ForgotPasswordEmailData = {
  email: string;
  resetUrl: string;
};

export async function sendForgotPasswordEmailJob({
  email,
  resetUrl,
}: ForgotPasswordEmailData) {
  await sendEmail({
    to: email,
    subject: "Reset Your Password",

    react: React.createElement(
      ForgotPasswordEmail,
      {
        resetUrl,
      }
    ),
  });
}