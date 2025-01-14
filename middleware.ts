import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/webhooks/stripe",
    "/api/adventure",
    "/sitemap.xml",
    "/api/cron/(.*)",
    "/share/quest",
    "/_axiom/logs",
    "/api/shared/(.*)",
    "/adventures",
    "/policies/(.*)",
    "/adventures/tagged/(.*)",
    /^\/adventures\/(?!(create|play|editor))[^\/]*$/,
    "/(.*)/opengraph-image",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
