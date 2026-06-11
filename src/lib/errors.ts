export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode = 400
  ) {
    super(message);
  }
}