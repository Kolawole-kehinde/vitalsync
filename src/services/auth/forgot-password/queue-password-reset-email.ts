import { emailQueue } from "@/src/lib/queue"

type ForgetPasswordEmailData = {
  email: string;
  resetToken: string;
};
export async function queueForgotPasswordEmail(data: ForgetPasswordEmailData){
  await emailQueue.add(
    "send-forget-password-email",{
       email: data.email,
       resetToken: data.resetToken,
},{
    attempts: 5,
    backoff: {
        type: "exponential",
        delay: 5000
    },
    removeOnComplete: 100,

    removeOnFail: 1000,
  }

);
}