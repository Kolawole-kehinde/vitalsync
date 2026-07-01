import { emailQueue } from "@/src/lib/queue";

export async function queueOnboardingEmail(
  email: string,
  firstName: string
) {
  await emailQueue.add(
    "send-onboarding-email",
    {
      email,
      firstName,
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