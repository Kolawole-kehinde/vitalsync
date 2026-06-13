import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// console.log(
//   "Resend configured:",
//   !!process.env.RESEND_API_KEY
// );

export async function sendVerificationEmail(email: string, otp: string) {
  const result = await resend.emails.send({
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

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result;
}
