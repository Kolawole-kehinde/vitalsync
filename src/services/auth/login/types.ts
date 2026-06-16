export type LoginData = {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
};

export type LoginResult = {
  success: boolean;
  user: {
    id: string;
    email: string;
    status: string;
  };
};

export type SessionData = {
  userId: string;
  email: string;
  role: string;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  city?: string;
  deviceName?: string;
};

export type AccessTokenPayload = {
  sub: string;
  sessionId: string;
  role: string;
};

export type CreateSessionResult = {
  sessionId: string;
  accessToken: string;
  refreshToken: string;
};