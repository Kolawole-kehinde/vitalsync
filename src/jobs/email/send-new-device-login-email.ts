import { sendEmail } from "@/src/lib/email";

type NewDeviceLoginData = {
  email: string;
  deviceName?: string;
  ipAddress?: string;
};

export async function sendNewDeviceLoginEmailJob(data: NewDeviceLoginData) {
  await sendEmail({
    to: data.email,
    subject: "New Device Login Detected",
    html: `
      <h2>New Device Login</h2>

      <p>
        A login was detected from a new device.
      </p>

      <p>
        Device:
        ${data.deviceName ?? "Unknown"}
      </p>

      <p>
        IP Address:
        ${data.ipAddress ?? "Unknown"}
      </p>

      <p>
        If this wasn't you,
        change your password immediately.
      </p>
    `,
  });
}
