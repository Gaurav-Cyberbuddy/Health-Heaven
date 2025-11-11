import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/profile(.*)',
  '/assessment(.*)',
  '/scanner(.*)',
  '/voice-entry(.*)',
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Skip auth check if Clerk is not configured (keyless mode disabled)
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    // Allow all routes if Clerk is not configured
    return NextResponse.next();
  }

  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};




