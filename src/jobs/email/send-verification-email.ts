import { sendVerificationEmail } from "@/src/lib/email";

export async function sendVerificationEmailJob(data: {
  email: string;
  otp: string;
}) {
  const { email, otp } = data;

  try {
    const result = await sendVerificationEmail(email, otp);

    console.log("Email sent:", result);
  } catch (error) {
    console.error("Email send failed:", error);

    throw error;
  }
}
