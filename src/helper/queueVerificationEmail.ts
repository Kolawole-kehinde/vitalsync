import { emailQueue } from "@/src/lib/queue";

export async function queueVerificationEmail(
  email: string,
  otp: string
) {
  await emailQueue.add(
    "send-verification-email",
    {
      email,
      otp,
    },
    {
      attempts: 5,

      backoff: {
        type: "exponential",
        delay: 5000,
      },

      removeOnComplete: 100,

      removeOnFail: 1000,
    }
  );
}