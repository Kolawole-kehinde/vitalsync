import type { UserRole } from "@prisma/client";

export type LoginData = {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
};

export type SessionData = {
  userId: string;
  email: string;
  role: UserRole;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  city?: string;
  deviceName?: string;
};

export type AccessTokenPayload = {
  sub: string;
  sid: string;
  role: string;
};

export type CreateSessionResult = {
  sessionId: string;
  accessToken: string;
  refreshToken: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;

  user: {
    id: string;
    email: string;
    role: UserRole;
  };
};