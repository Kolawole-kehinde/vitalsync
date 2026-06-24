import { sendEmail } from "@/src/lib/email";

type SendVerificationEmailData = {
email: string;
otp: string;
};

export async function sendVerificationEmailJob(
data: SendVerificationEmailData
) {
await sendEmail({
to: data.email,
subject:
"Verify your VitaSync account",
html: ` <h2>Email Verification</h2>

  <p>
    Your verification code is:
  </p>

  <h1>${data.otp}</h1>

  <p>
    This code expires in 15 minutes.
  </p>
`,


});
}
