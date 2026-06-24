

import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function sendForgotPasswordEmail(
  email: string,
  resetUrl: string
) {
  return await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset Request</h2>

      <p>
        Click the link below to reset your password:
      </p>

      <a href="${resetUrl}">
        Reset Password
      </a>

      <p>
        This link expires in 15 minutes.
      </p>
    `,
  });
}