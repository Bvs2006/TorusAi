/**
 * Utility functions for streak tracking
 */

export async function trackUserActivity(
  userId: string,
  activityType: 'project_created' | 'feature_added' | 'phase_completed' | 'error_fixed' | 'ai_plan_generated' | 'prompt_generated',
  activityData?: Record<string, any>
) {
  try {
    const response = await fetch('/api/streaks/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        activity_type: activityType,
        activity_data: activityData || {}
      })
    })

    if (!response.ok) {
      console.error('Failed to track activity:', await response.text())
      return false
    }

    return true
  } catch (error) {
    console.error('Error tracking activity:', error)
    return false
  }
}

/**
 * Get streak information for a user
 */
export async function getStreakInfo(userId: string) {
  try {
    const response = await fetch(`/api/streaks/get?user_id=${userId}`)

    if (!response.ok) {
      console.error('Failed to get streak info:', await response.text())
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error getting streak info:', error)
    return null
  }
}

/**
 * Format streak information for display
 */
export function formatStreakInfo(streak: {
  current_streak: number
  max_streak: number
  last_activity_date: string
}) {
  const lastActivityDate = new Date(streak.last_activity_date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const lastActivityDateOnly = new Date(lastActivityDate).toDateString()
  const todayOnly = today.toDateString()
  const yesterdayOnly = yesterday.toDateString()

  const isActive = lastActivityDateOnly === todayOnly || lastActivityDateOnly === yesterdayOnly

  return {
    current_streak: streak.current_streak,
    max_streak: streak.max_streak,
    is_active: isActive,
    days_to_loss: isActive ? 2 : 1,
    display_text: isActive ? '🔥 Keep your streak going!' : '⚠️ Your streak ended - Start a new one!'
  }
}

/**
 * Get badge display information
 */
export const BADGE_CONFIG = {
  '1_month': {
    label: '1 Month',
    description: '30 consecutive days',
    days: 30,
    color: '#60a5fa',
    icon: '🟦',
    rarity: 'common'
  },
  '3_months': {
    label: '3 Months',
    description: '90 consecutive days',
    days: 90,
    color: '#8b5cf6',
    icon: '🟣',
    rarity: 'rare'
  },
  '6_months': {
    label: '6 Months',
    description: '180 consecutive days',
    days: 180,
    color: '#ec4899',
    icon: '🌸',
    rarity: 'epic'
  },
  '12_months': {
    label: '1 Year',
    description: '365 consecutive days',
    days: 365,
    color: '#f59e0b',
    icon: '⭐',
    rarity: 'legendary'
  },
  '24_months': {
    label: '2 Years',
    description: '730 consecutive days',
    days: 730,
    color: '#ef4444',
    icon: '💎',
    rarity: 'legendary'
  }
}
