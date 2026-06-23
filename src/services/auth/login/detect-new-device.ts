import { prisma } from "@/src/lib/prisma";
import { redis } from "@/src/lib/redis";

type DetectNewDeviceData = {
  userId: string;
  deviceName?: string;
};

export async function detectNewDevice(data: DetectNewDeviceData) {
  if (!data.deviceName) {
    return false;
  }

  const existingSession =
    await prisma.session.findFirst({
      where: {
        userId: data.userId,
        deviceName: data.deviceName,
      },
    });

  if (existingSession) {
    return false;
  }

  const lockKey = `new-device-lock:${data.userId}:${data.deviceName}`;

  const lock = await redis.set(
    lockKey,
    "1",
    "EX",
    60,
    "NX"
  );

  if (lock !== "OK") {
    return false;
  }

  return true;
}