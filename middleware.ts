import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Protect all routes except for the listed public paths
const protectedPaths = [
  "/music/:path*",
  "/albums/:path*",
  "/artists/:path*",
  "/playlists/:path*",
  "/tracks/:path*",
  "/search/:path*",
  "/api/auth",
  "/api/signup",
  "/images",
  "/covers",
  "/tracks",
  "/fonts",
  "/browse",
];

const publicPaths = [
  "/signin",
  "/signup",
];

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
    



  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/signin",
    },
  }
);


export const config = {
  matcher: [
    "/music/:path*",
    "/albums/:path*",
    "/artists/:path*",
    "/playlists/:path*",
    "/tracks/:path*",
    "/search/:path*",
    "/api/auth/:path*",
    "/browse/:path*",
    // "/browse",
  ],
};