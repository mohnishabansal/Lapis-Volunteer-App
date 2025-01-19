// Add this middleware to check authentication
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Check if user is accessing protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const sessionId = request.cookies.get('session');
    
    if (!sessionId) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*'
}