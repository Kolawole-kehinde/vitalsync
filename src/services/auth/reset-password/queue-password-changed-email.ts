import { emailQueue } from "@/src/lib/queue";

type PasswordChangedEmailData = {
email: string;
};

export async function queuePasswordChangedEmail(data: PasswordChangedEmailData) {
await emailQueue.add(
"send-password-changed-email",
{
email: data.email,
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
