// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Note: middleware runs on the Edge runtime and cannot import Node-only
// libraries like `firebase-admin`. Verify tokens on a server (API route)
// that runs on Node. Here we only check cookie presence and redirect.

const protectedPaths = ['/dashboard'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Client'tan gelen ID token veya oturum cookie'sinin varlığını kontrol et
  const idToken = request.cookies.get('__session')?.value;

  if (!idToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // NOT: Token doğrulamasını burada yapmıyoruz çünkü `firebase-admin`
  // Edge'de çalışmaz. Doğrulamayı `/api/auth/verify` gibi Node tabanlı
  // bir API route içinde yap; middleware sadece varlık kontrolü sağlar.
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};