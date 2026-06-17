import { emailQueue } from "@/src/lib/queue";

type NotifyNewDeviceData = {
  email: string;
  deviceName?: string;
  ipAddress?: string;
};

export async function notifyNewDevice(data: NotifyNewDeviceData) {
  await emailQueue.add(
    "new-device-login",{
      email: data.email,
      deviceName: data.deviceName,
      ipAddress: data.ipAddress,
    }
  );
}