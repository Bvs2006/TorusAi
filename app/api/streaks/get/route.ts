import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseServiceRole) return null
  return createClient(supabaseUrl, supabaseServiceRole)
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 })
    }

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
      const today = new Date().toISOString().split('T')[0]
      const { data: createdStreak, error: createError } = await supabase
        .from('streaks')
        .insert([
          {
            user_id: userId,
            current_streak: 0,
            max_streak: 0,
            last_activity_date: today,
            streak_started_at: new Date().toISOString(),
          },
        ])
        .select('*')
        .single()

      if (createError || !createdStreak) {
        return NextResponse.json({ error: 'Failed to initialize streak' }, { status: 500 })
      }

      const { data: badges } = await supabase
        .from('streak_badges')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false })

      return NextResponse.json({
        streak: createdStreak,
        badges: badges || [],
        recentActivity: []
      })
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
