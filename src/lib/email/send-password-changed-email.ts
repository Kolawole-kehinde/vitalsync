import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function sendPasswordChangedEmail(
  email: string
) {
  return await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Password Changed",
    html: `
      <h2>Password Changed</h2>

      <p>
        Your password was changed successfully.
      </p>

      <p>
        If this wasn't you,
        contact support immediately.
      </p>
    `,
  });
}