export type AuthTokenResp = {
    access_token: string;
    refresh_token: string;
  };

  import {
    NextMiddleware
  } from "next/server";
  
  export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;