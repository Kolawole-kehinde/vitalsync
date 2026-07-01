import React from "react";

import NewDeviceLoginEmail from "@/src/emails/NewDeviceLoginEmail";
import { sendEmail } from "@/src/lib/email/send-email";


type NewDeviceLoginEmailJobData = {
  email: string;
  deviceName?: string;
  ipAddress?: string;
};

export async function sendNewDeviceLoginEmailJob({
  email,
  deviceName,
  ipAddress,
}: NewDeviceLoginEmailJobData) {
  await sendEmail({
    to: email,
    subject: "New Device Login",

    react: React.createElement(
      NewDeviceLoginEmail,
      {
        deviceName,
        ipAddress,
      }
    ),
  });
}