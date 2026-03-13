import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function proxy(req) {
  const { pathname } = req.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/' ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const code = pathname.replace('/', '')
  if (!code) return NextResponse.next()

  const { data } = await supabase
    .from('links')
    .select('original_url')
    .eq('short_code', code)
    .single()

  if (data?.original_url) {
    await supabase.from('clicks').insert({ short_code: code })
    return NextResponse.redirect(data.original_url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
}