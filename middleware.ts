import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/signup', '/']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Check if user has auth token (Firebase sets this in client)
  const hasAuthToken = request.cookies.has('auth-token')

  // Redirect to login if accessing protected route without auth
  if (!isPublicRoute && !hasAuthToken && !pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Redirect to dashboard if accessing auth pages while logged in
  if (isPublicRoute && hasAuthToken && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
