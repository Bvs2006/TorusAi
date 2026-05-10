import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseServiceRole) return null
  return createClient(supabaseUrl, supabaseServiceRole)
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 })
    }

    const { user_id, activity_type, activity_data } = await req.json()

    if (!user_id || !activity_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]

    // Record user activity
    await supabase.from('user_activity').upsert([{
      user_id,
      activity_date: today,
      activity_type,
      activity_data: activity_data || {}
    }], { onConflict: 'user_id,activity_date,activity_type' })

    // Get or create streak record
    const { data: existingStreak } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', user_id)
      .single()

    if (!existingStreak) {
      await supabase.from('streaks').insert([{
        user_id,
        current_streak: 1,
        max_streak: 1,
        last_activity_date: today,
        streak_started_at: new Date().toISOString()
      }])
    } else {
      // Calculate new streak
      const lastActivityDate = new Date(existingStreak.last_activity_date)
      const today_date = new Date(today)
      const daysDiff = Math.floor((today_date.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24))

      let newStreak = existingStreak.current_streak
      let streakStarted = existingStreak.streak_started_at

      if (daysDiff === 0) {
        // Same day activity, don't change streak
        newStreak = existingStreak.current_streak
      } else if (daysDiff === 1) {
        // Consecutive day, increment streak
        newStreak = existingStreak.current_streak + 1
      } else {
        // Streak broken, reset
        newStreak = 1
        streakStarted = new Date().toISOString()
      }

      const maxStreak = Math.max(newStreak, existingStreak.max_streak)

      // Update streak
      await supabase
        .from('streaks')
        .update({
          current_streak: newStreak,
          max_streak: maxStreak,
          last_activity_date: today,
          streak_started_at: streakStarted,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user_id)

      // Check for badge awards (every 30 days)
      await checkAndAwardStreakBadges(supabase, user_id, newStreak)
    }

    return NextResponse.json({ success: true, message: 'Streak tracked successfully' })
  } catch (error) {
    console.error('Error tracking streak:', error)
    return NextResponse.json({ error: 'Failed to track streak' }, { status: 500 })
  }
}

async function checkAndAwardStreakBadges(supabase: any, user_id: string, currentStreak: number) {
  const badges = [
    { days: 30, type: '1_month' },
    { days: 90, type: '3_months' },
    { days: 180, type: '6_months' },
    { days: 365, type: '12_months' },
    { days: 730, type: '24_months' }
  ]

  for (const badge of badges) {
    if (currentStreak >= badge.days) {
      const { data: existingBadge } = await supabase
        .from('streak_badges')
        .select('*')
        .eq('user_id', user_id)
        .eq('badge_type', badge.type)
        .single()

      if (!existingBadge) {
        await supabase.from('streak_badges').insert([{
          user_id,
          badge_type: badge.type,
          streak_value: currentStreak,
          earned_at: new Date().toISOString()
        }])
      }
    }
  }
}
