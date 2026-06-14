// login/types.ts

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