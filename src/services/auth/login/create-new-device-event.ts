import { prisma } from "@/src/lib/prisma";

type CreateNewDeviceEventData = {
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  deviceName?: string;
};

export async function createNewDeviceEvent(
  data: CreateNewDeviceEventData
) {
  await prisma.securityEvent.create({
    data: {
      userId: data.userId,
      type: "NEW_DEVICE_LOGIN",

      ipAddress:
        data.ipAddress,

      userAgent:
        data.userAgent,

      metadata: {
        deviceName:
          data.deviceName,
      },
    },
  });
}