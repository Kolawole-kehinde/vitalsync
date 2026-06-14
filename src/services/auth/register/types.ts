export type RegisterData = {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
};

export type PendingRegistrationData = {
  email: string;
  passwordHash: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
};

export type OtpRedisPayload = {
  otpHash: string;
  attempts: number;
  lockedUntil: number | null;
};