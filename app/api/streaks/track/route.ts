import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/utils/firebase/admin'

const streakRef = (userId: string) => adminDb.collection('streaks').doc(userId)

export async function POST(req: NextRequest) {
  try {
    const { user_id, activity_type, activity_data } = await req.json()

    if (!user_id || !activity_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]
    const now = new Date().toISOString()
    const activityId = `${user_id}_${today}_${activity_type}`
    const activityRef = adminDb.collection('user_activity').doc(activityId)
    const docRef = streakRef(user_id)
    const streakSnap = await docRef.get()

    await activityRef.set({
      user_id,
      activity_date: today,
      activity_type,
      activity_data: activity_data || {},
      updated_at: now,
    }, { merge: true })

    if (!streakSnap.exists) {
      await docRef.set({
        user_id,
        current_streak: 1,
        max_streak: 1,
        last_activity_date: today,
        streak_started_at: now,
        updated_at: now,
      })

      return NextResponse.json({ success: true, message: 'Streak tracked successfully' })
    }

    const existingStreak = streakSnap.data() || {}
    const lastActivityDate = new Date(existingStreak.last_activity_date)
    const todayDate = new Date(today)
    const daysDiff = Math.floor((todayDate.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24))

    let newStreak = Number(existingStreak.current_streak || 0)
    let streakStarted = existingStreak.streak_started_at || now

    if (daysDiff === 0) {
      newStreak = Number(existingStreak.current_streak || 0)
    } else if (daysDiff === 1) {
      newStreak = Number(existingStreak.current_streak || 0) + 1
    } else {
      newStreak = 1
      streakStarted = now
    }

    const maxStreak = Math.max(newStreak, Number(existingStreak.max_streak || 0))

    await docRef.set({
      user_id,
      current_streak: newStreak,
      max_streak: maxStreak,
      last_activity_date: today,
      streak_started_at: streakStarted,
      updated_at: now,
    }, { merge: true })

    await checkAndAwardStreakBadges(user_id, newStreak, now)

    return NextResponse.json({ success: true, message: 'Streak tracked successfully' })
  } catch (error) {
    console.error('Error tracking streak:', error)
    return NextResponse.json({ error: 'Failed to track streak' }, { status: 500 })
  }
}

async function checkAndAwardStreakBadges(userId: string, currentStreak: number, earnedAt: string) {
  const badges = [
    { days: 30, type: '1_month' },
    { days: 90, type: '3_months' },
    { days: 180, type: '6_months' },
    { days: 365, type: '12_months' },
    { days: 730, type: '24_months' },
  ]

  for (const badge of badges) {
    if (currentStreak < badge.days) continue

    const badgeRef = adminDb.collection('streak_badges').doc(`${userId}_${badge.type}`)
    const badgeSnap = await badgeRef.get()

    if (!badgeSnap.exists) {
      await badgeRef.set({
        user_id: userId,
        badge_type: badge.type,
        streak_value: currentStreak,
        earned_at: earnedAt,
      })
    }
  }
}
