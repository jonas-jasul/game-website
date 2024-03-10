import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import createIntlMiddleware from "next-intl/middleware";
import type { AuthTokenResp } from "./types";
// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
// import { NextResponse } from 'next/server'
import prisma from "./lib/prisma";
// import { json } from "stream/consumers";
import { cookies } from "next/headers";

// export default createMiddleware({
//   // A list of all locales that are supported
//   locales: ['en', 'lt'],
//   defaultLocale: 'en',

//   // If this locale is matched, pathnames work without a prefix (e.g. `/about`)

// });

const localizationMiddleware = createIntlMiddleware({
  locales: ["en", "lt"],
  defaultLocale: "en",
});

const middleware = async (request: NextRequest) => {
  let accessToken:string | null =null;
  let refreshToken:string | null =null;
  // const reqHeaders = new Headers(request.headers);
  try {
    const mostRecentApiToken = await prisma.apiToken.findFirst({
      orderBy: {
        addedOn: "desc",
      },
    });
    if (mostRecentApiToken) {
      accessToken=mostRecentApiToken.accessToken;
      refreshToken=mostRecentApiToken.refreshToken
      console.log(accessToken);

      try {
        const url = "https://api.igdb.com/v4/games/";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Client-ID": process.env.NEXT_PUBLIC_CLIENT_ID,
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: "fields name; limit 1;",
        });

        const data = await response.json();
        console.log("Data0", data);

        if (response.status === 401) {
          try {
            console.log("starting");
            const url = "https://id.twitch.tv/oauth2/token";
            const responseToken = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
              }),
            });
            if (responseToken.ok) {
              const newTokens: AuthTokenResp = await responseToken.json();
              // const { access_token: newAccessToken, refresh_token: newRefreshToken } =
              //   newTokens;

              // console.log("acc", newTokens);

              await prisma.apiToken.create({
                data: {
                  accessToken: newTokens.access_token,
                  refreshToken: newTokens.refresh_token,
                  addedOn: new Date(),
                },
              });
            }
          } catch (err) {
            console.error(err);
          }
        }
        // console.log("test req", data);
      } catch (error) {
        console.log("err", error);
      }

      // reqHeaders.set("X-Api-Authorization", `Bearer ${accessToken}`);
      // const authorizationHeaderSet = reqHeaders.get("X-Api-Authorization");
      // console.log("Is Authorization header set now:", authorizationHeaderSet);
     
    }
  } catch (err) {
    console.error(err);
  }
  const res = localizationMiddleware(request);
  const cookie = `Bearer ${accessToken}`;
  res.cookies.set({
    name: "tokenCookie",
    value: cookie,
    httpOnly: true,
    path: "/",
  });
  return res;
};
export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

export { middleware };
