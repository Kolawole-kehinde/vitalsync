import { sendEmail } from "@/src/lib/email";

type PasswordChangedEmailData = {
email: string;
};

export async function sendPasswordChangedEmailJob(
data: PasswordChangedEmailData
) {
await sendEmail({
to: data.email,
subject:"Password Changed",
html: ` <h2>Password Changed</h2>

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
