import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/utils/firebase/admin'

export const dynamic = 'force-dynamic'

const streakRef = (userId: string) => adminDb.collection('streaks').doc(userId)

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]
    const docRef = streakRef(userId)
    const streakSnap = await docRef.get()

    let streak = streakSnap.data()

    if (!streakSnap.exists || !streak) {
      streak = {
        user_id: userId,
        current_streak: 0,
        max_streak: 0,
        last_activity_date: today,
        streak_started_at: new Date().toISOString(),
      }
      await docRef.set(streak)
    }

    const [badgesSnap, recentActivitySnap] = await Promise.all([
      adminDb
        .collection('streak_badges')
        .where('user_id', '==', userId)
        .orderBy('earned_at', 'desc')
        .get(),
      adminDb
        .collection('user_activity')
        .where('user_id', '==', userId)
        .orderBy('activity_date', 'desc')
        .limit(30)
        .get(),
    ])

    return NextResponse.json({
      streak,
      badges: badgesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      recentActivity: recentActivitySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    })
  } catch (error) {
    console.error('Error fetching streak:', error)
    return NextResponse.json({ error: 'Failed to fetch streak' }, { status: 500 })
  }
}
