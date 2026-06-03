import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'id'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (hasLocale) {
    return NextResponse.next();
  }

  // Try to get locale from Accept-Language header
  const localeFromHeader = request.headers
    .get('accept-language')
    ?.split(',')[0]
    ?.split('-')[0];

  const locale = locales.includes(localeFromHeader || '') ? localeFromHeader : defaultLocale;

  // Redirect to locale path
  return NextResponse.redirect(
    new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
  );
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.well-known).*)'],
};
