import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Always skip authentication for the login page
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }
  
  // Check if the request is for the admin page
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // For client-side auth, we'll rely on the form redirecting unauthorized users
    // Get the auth cookie for server-side validation
    const authCookie = request.cookies.get('adminAuth')
    
    // If we have the cookie and it's valid, allow access
    if (authCookie && authCookie.value === 'true') {
      return NextResponse.next()
    }
    
    // If no valid cookie, redirect to the login page
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  
  // Continue for non-admin routes
  return NextResponse.next()
}

export const config = {
  // Matcher for routes that should trigger this middleware
  matcher: ['/admin/:path*'],
} 