import createMiddleware from 'next-intl/middleware';
// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
// import { NextResponse } from 'next/server'

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'lt'],
  defaultLocale: 'en',

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)

});
 
export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
