import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function middleware(req) {
  const { pathname } = req.nextUrl

  // Skip Next.js internal routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/' ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Extract the short code
  const code = pathname.replace('/', '')

  if (!code) return NextResponse.next()

  // Look up the original URL
  const { data } = await supabase
    .from('links')
    .select('original_url')
    .eq('short_code', code)
    .single()

  console.log("MIDDLEWARE CODE:", code)
  console.log("MIDDLEWARE DATA:", data)

  if (data?.original_url) {
    // Log the click
    await supabase.from('clicks').insert({ short_code: code })
    return NextResponse.redirect(data.original_url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
}