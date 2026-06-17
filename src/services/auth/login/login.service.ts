import { AuthError } from "@/src/lib/errors";

import { validateUser } from "./validate-user";
import { verifyPassword } from "./verify-password";
import { handleFailedLogin } from "./handle-failed-login";
import { handleSuccessfulLogin } from "./handle-successful-login";
import { createSession } from "./create-session";

import { LoginData } from "./types";
import { getLocation } from "./get-location";
import { parseDevice } from "./parse-device";
import { detectNewDevice } from "./detect-new-device";
import { createNewDeviceEvent } from "./create-new-device-event";
import { notifyNewDevice } from "./notify-new-device";

export async function loginService(data: LoginData) {
  const email = data.email.trim().toLowerCase();

  const user = await validateUser({
      email,
      password: data.password,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    });

  const isValidPassword = await verifyPassword({
      passwordHash: user.passwordHash,
      password: data.password,
    });

  if (!isValidPassword) {
    await handleFailedLogin({
      user,
      email,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    });

    throw new AuthError(
      "Invalid credentials",
      401
    );
  }

  await handleSuccessfulLogin({
    user,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
  });

  const location = await getLocation( data.ipAddress);
  console.log("IP:",data.ipAddress);

// const location = await getLocation("8.8.8.8");
// console.log(location);

  const deviceName = parseDevice(data.userAgent);
  console.log(data.userAgent);

  const isNewDevice = await detectNewDevice({
    userId: user.id,
    deviceName,
  });

  if (isNewDevice) {
  await createNewDeviceEvent({
    userId: user.id,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    deviceName,
  });

    await notifyNewDevice({
    email: user.email,
    deviceName,
    ipAddress: data.ipAddress,
  });
}

 const session = await createSession({
  userId: user.id,
  email: user.email,
  role: user.role,
  ipAddress: data.ipAddress,
  userAgent: data.userAgent,
  country: location.country,
  city: location.city,
  latitude: location.latitude,
  longitude: location.longitude,
  deviceName,
});
  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    session,
  };
}