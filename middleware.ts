import {
  // authMiddleware,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";

// Define public routes
const isPublicRoute = createRouteMatcher(["/", "/events/:id"]);

// Define ignored routes (e.g., webhooks)
const isIgnoredRoute = createRouteMatcher([
  "/api/webhook/clerk",
  "/api/webhook/stripe",
]);

export default clerkMiddleware((auth, req) => {
  // Ignore webhook routes (don't require authentication)
  if (isIgnoredRoute(req)) {
    return;
  }

  // Protect all other routes except public ones
  if (isPublicRoute(req)) {
    auth().protect(); // Automatically handles redirects to sign-in if user is not authenticated
  }
});

// export default authMiddleware({
//   publicRoutes: ["/", "/events/:id"],
//   ignoredRoutes: [
//     "/api/webhook/clerk", // Ignore webhooks because they don't require authentication
//     "/api/webhook/stripe",
//   ],
// });

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

// const isPublicRoute = createRouteMatcher([
//   "/sign-in(.*)",
//   "/sign-up(.*)",
//   "/events/:id",
//   "/",
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
// clerkMiddleware,
//   createRouteMatcher,
