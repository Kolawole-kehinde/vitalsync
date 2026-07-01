import { render } from "@react-email/render";
import { Resend } from "resend";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailOptions = {
  to: string;
  subject: string;
  react: React.ReactElement;
};

export async function sendEmail({
  to,
  subject,
  react,
}: SendEmailOptions) {
  const html = await render(react);

  return await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    html,
  });
}