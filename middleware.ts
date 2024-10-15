import { authMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/events/:id",
    "/api/webhook/clerk",
    "/api/webhook/stripe",
    "/api/uploadthing",
  ],
  ignoredRoutes: [
    "/api/webhook/clerk",
    "/api/webhook/stripe",
    "/api/uploadthing",
  ],
});

// const isPublicRoute = createRouteMatcher([
// "/sign-in(.*)",
// "/sign-up(.*)",
// "/",
// "/events/:id",
// ]);

// const ignoredRoutes = createRouteMatcher([
//   "/api/webhook/clerk",
//   "/api/webhook/stripe",
//   "/api/uploadthing",
// ]);

// export default clerkMiddleware((auth, request) => {
//   if (!isPublicRoute(request)) {
//     auth().protect();
//   }
// });

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
