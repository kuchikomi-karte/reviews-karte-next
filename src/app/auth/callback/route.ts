import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const loginUrl = new URL('/login', requestUrl.origin)
  loginUrl.searchParams.set('error', 'oauth_callback')

  if (!code) {
    return NextResponse.redirect(loginUrl)
  }

  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore,
    })
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(loginUrl)
    }
  } catch {
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}
