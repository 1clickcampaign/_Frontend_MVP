import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { User } from '@/types/database'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser() as { data: { user: User | null } }

  if (user) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data && !error) {
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
    }
  } else {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
  }
}
