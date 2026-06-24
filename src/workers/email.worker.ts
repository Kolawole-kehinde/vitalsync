import "dotenv/config";
import { Worker } from "bullmq";
import { redis } from "../lib/redis";
import { sendVerificationEmailJob } from "../jobs/email/send-verification-email";

import { sendForgotPasswordEmailJob }
from "../jobs/email/send-forgot-password-email";
import { sendPasswordChangedEmailJob } from "../jobs/email/send-password-changed-email";
import { sendNewDeviceLoginEmailJob } from "../jobs/email/send-new-device-login-email";


const worker = new Worker("email-queue",async (job) => {
   switch (job.name) {
  case "send-verification-email":
    await sendVerificationEmailJob(
      job.data
    );
    break;

  case "send-forget-password-email":
    await sendForgotPasswordEmailJob(
      job.data
    );
    break;

  case "send-password-changed-email":
    await sendPasswordChangedEmailJob(
      job.data
    );
    break;

    case "new-device-login":
  await sendNewDeviceLoginEmailJob(
    job.data
  );
  break;

  default:
    throw new Error(
      `Unknown job: ${job.name}`
    );
}
  },
  {
    connection: redis,
  },
);



worker.on("ready", () => {
  console.log("Email Worker Ready");
});

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed`, error);
});

worker.on("error", (error) => {
  console.error("Worker Error:", error);
});

console.log(" Email Worker Started");
