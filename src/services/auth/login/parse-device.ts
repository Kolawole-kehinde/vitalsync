import { UAParser } from "ua-parser-js";

export function parseDevice(
  userAgent?: string
) {
  if (!userAgent) {
    return "Unknown Device";
  }

  if (
    userAgent.includes(
      "PostmanRuntime"
    )
  ) {
    return "Postman";
  }

  const parser = new UAParser(
    userAgent
  );

  const browser =
    parser.getBrowser().name;

  const os =
    parser.getOS().name;

  if (!browser && !os) {
    return "Unknown Device";
  }

  return `${browser ?? "Unknown Browser"} on ${os ?? "Unknown OS"}`;
}