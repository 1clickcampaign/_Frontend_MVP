import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Check if user exists in the users table
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (userError && userError.code === 'PGRST116') {
        // User doesn't exist, create a new record
        const { error: insertError } = await supabase
          .from('users')
          .insert({ 
            id: data.user.id, 
            email: data.user.email,
            name: data.user.user_metadata.full_name || data.user.email,
            credits: 100,
            profile_picture: data.user.user_metadata.avatar_url
          })

        if (insertError) {
          console.error('Error creating user record:', insertError)
          return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Failed to create user record')}`)
        }
      } else if (existingUser) {
        // Update existing user's profile picture if it has changed
        const { error: updateError } = await supabase
          .from('users')
          .update({ profile_picture: data.user.user_metadata.avatar_url })
          .eq('id', data.user.id)

        if (updateError) {
          console.error('Error updating user profile picture:', updateError)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Authentication failed')}`)
}
