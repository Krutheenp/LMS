import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  // ===== Route Protection =====

  // If accessing /admin without token or not admin, redirect to login
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Add role check here (you'll need to decode JWT and check role)
    // For now, basic token check
  }

  // If accessing /activities without token, redirect to login
  if (
    request.nextUrl.pathname.startsWith('/activities') ||
    request.nextUrl.pathname === '/profile' ||
    request.nextUrl.pathname === '/'
  ) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // If accessing /login or /register with token, redirect to dashboard
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
