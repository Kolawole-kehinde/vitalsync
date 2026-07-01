import WelcomeEmail from "@/src/emails/WelcomeEmail";
import { sendEmail } from "@/src/lib/email/send-email";


type SendOnboardingEmailJobData = {
  email: string;
  firstName: string;
};

export async function sendOnboardingEmailJob({
  email,
  firstName,
}: SendOnboardingEmailJobData) {
  await sendEmail({
    to: email,
    subject: "🎉 Welcome to VitaOS",
    react: (
      <WelcomeEmail
        firstName={firstName}
      />
    ),
  });
}