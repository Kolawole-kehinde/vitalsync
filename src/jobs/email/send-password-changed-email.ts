import React from "react";

import PasswordChangedEmail from "@/src/emails/PasswordChangedEmail";
import { sendEmail } from "@/src/lib/email/send-email";



type PasswordChangedEmailData = {
  email: string;
};

export async function sendPasswordChangedEmailJob({
  email,
}: PasswordChangedEmailData) {
  await sendEmail({
    to: email,
    subject: "Password Changed",

    react: React.createElement(
      PasswordChangedEmail
    ),
  });
}