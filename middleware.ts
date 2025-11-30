import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    
    // Allow API routes, static files, and Next.js internals
    if (
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/static') ||
      pathname.startsWith('/favicon') ||
      pathname.includes('.') ||
      pathname === '/robots.txt'
    ) {
      return NextResponse.next();
    }

    // Get auth token safely
    const token = request.cookies.get('auth-token')?.value;

    // Handle root path - let the page component handle redirect
    if (pathname === '/') {
      return NextResponse.next();
    }

    // Allow login page access
    if (pathname === '/login') {
      // Redirect authenticated users away from login
      if (token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return NextResponse.next();
    }

    // Protect dashboard and other routes
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If middleware fails, allow the request to proceed
    // This prevents middleware from breaking the entire app
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
};

