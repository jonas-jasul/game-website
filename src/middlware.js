import createMiddleware from 'next-intl/middleware';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'lt'],
  defaultLocale: 'en',
  localePrefix: 'always'

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)

});
 
// export const config = {
//   // Skip all paths that should not be internationalized
//   matcher: ['/((?!api|_next|.*\\..*).*)']
// };

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // // if user is signed in and the current path is / redirect the user to /account
  // if (user && req.nextUrl.pathname === '/') {
  //   return NextResponse.redirect(new URL('/account', req.url))
  // }

  // // if user is not signed in and the current path is not / redirect the user to /
  // if (!user && req.nextUrl.pathname !== '/') {
  //   return NextResponse.redirect(new URL('/', req.url))
  // }

  return res
}

export const config = {
  matcher: ['/profile'],
}