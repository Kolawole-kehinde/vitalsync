import { sendEmail } from "@/src/lib/email";

type SendForgotPasswordEmailData = {
email: string;
resetToken: string;
};

export async function sendForgotPasswordEmailJob(data: SendForgotPasswordEmailData) {

const resetUrl =`${process.env.APP_URL}/reset-password?token=${data.resetToken}`;

await sendEmail({
to: data.email,
subject: "Reset Your Password",
html: ` <h2>Password Reset Request</h2>

  <p>
    We received a request to reset your password.
  </p>

  <p>
    Click the link below:
  </p>

  <a href="${resetUrl}">
    Reset Password
  </a>

  <p>
    This link expires in 15 minutes.
  </p>

  <p>
    If you didn't request this,
    you can safely ignore this email.
  </p>
`,

});
}
