import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function sendVerificationEmail(
  email: string,
  otp: string
) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Verify your VitaSync account",
    html: `
      <h2>Email Verification</h2>
      <p>Your verification code is:</p>

      <h1>${otp}</h1>

      <p>This code expires in 15 minutes.</p>
    `,
  });
}