import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

// Use a fresh client — not the cached one
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET(req, { params }) {
  const { code } = await params

  // Log the click
  await supabase
    .from('clicks')
    .insert({ short_code: code })

  // Find the original URL
  const { data, error } = await supabase
    .from('links')
    .select('original_url')
    .eq('short_code', code)
    .single()

  console.log("CODE:", code)
  console.log("DATA:", data)
  console.log("ERROR:", error)

  if (!data) redirect('/')

  redirect(data.original_url)
}