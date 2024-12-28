import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const listId = searchParams.get('id')

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!listId) {
    // Fetch all lists for the user
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  }

  // Check if the list belongs to the user
  const { data: listData, error: listError } = await supabase
    .from('lists')
    .select('*')
    .eq('id', listId)
    .eq('user_id', user.id)
    .single()

  if (listError || !listData) {
    return NextResponse.json({ error: 'List not found or unauthorized' }, { status: 404 })
  }

  // Fetch the leads for this list
  const { data: leadsData, error: leadsError } = await supabase
    .from('list_leads')
    .select(`
      leads (
        id,
        name,
        business_email,
        business_phone,
        decision_maker_name,
        decision_maker_email,
        decision_maker_phone
      )
    `)
    .eq('list_id', listId)

  if (leadsError) {
    return NextResponse.json({ error: leadsError.message }, { status: 500 })
  }

  // Transform the data to flatten the structure
  const leads = leadsData.map(item => item.leads)

  return NextResponse.json(leads)
}
