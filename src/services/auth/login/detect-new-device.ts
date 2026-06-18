import { prisma } from "@/src/lib/prisma";

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
        deviceName:
          data.deviceName,
      },
    });

  return !existingSession;
}