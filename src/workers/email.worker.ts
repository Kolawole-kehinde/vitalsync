import "dotenv/config";
import { Worker } from "bullmq";
import { redis } from "../lib/redis";
import { sendVerificationEmailJob } from "../jobs/email/send-verification-email";

const worker = new Worker(
  "email-queue",
  async (job) => {
    switch (job.name) {
      case "send-verification-email":
        await sendVerificationEmailJob(job.data);
        break;

      default:
        throw new Error(`Unknown job: ${job.name}`);
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
