import { NextResponse } from "next/server";

import {ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE,ACCESS_TOKEN_MAX_AGE,REFRESH_TOKEN_MAX_AGE,} from "@/src/constants/cookie.constants";

type SetAuthCookiesData = {
  accessToken: string;
  refreshToken: string;
};

export function setAuthCookies(response: NextResponse, data: SetAuthCookiesData,) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE, data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}
