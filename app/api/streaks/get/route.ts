import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceRole)

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
    }

    // Get streak info
    const { data: streak, error: streakError } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (streakError) {
      return NextResponse.json({ error: 'Streak not found' }, { status: 404 })
    }

    // Get streak badges
    const { data: badges } = await supabase
      .from('streak_badges')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })

    // Get recent activity
    const { data: recentActivity } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', userId)
      .order('activity_date', { ascending: false })
      .limit(30)

    return NextResponse.json({
      streak,
      badges: badges || [],
      recentActivity: recentActivity || []
    })
  } catch (error) {
    console.error('Error fetching streak:', error)
    return NextResponse.json({ error: 'Failed to fetch streak' }, { status: 500 })
  }
}
