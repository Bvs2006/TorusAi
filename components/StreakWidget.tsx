'use client'

import { Flame, TrendingUp, Sparkles, Award } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface StreakWidgetProps {
  userId: string
}

export default function StreakWidget({ userId }: StreakWidgetProps) {
  const [streak, setStreak] = useState<{
    current_streak: number
    max_streak: number
    last_activity_date: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await fetch(`/api/streaks/get?user_id=${userId}`)
        if (response.ok) {
          const data = await response.json()
          if (data?.streak) {
            setStreak(data.streak)

            const lastActivityDate = new Date(data.streak.last_activity_date)
            const today = new Date()
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)

            const lastActivityDateOnly = new Date(lastActivityDate).toDateString()
            const todayOnly = today.toDateString()
            const yesterdayOnly = yesterday.toDateString()

            setIsActive(lastActivityDateOnly === todayOnly || lastActivityDateOnly === yesterdayOnly)
          }
        }
      } catch (error) {
        console.error('Error fetching streak:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchStreak()
    } else {
      setLoading(false)
    }
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-3 text-xs text-neutral-400 font-mono">
        <div className="w-4 h-4 border-2 border-purple-500/40 border-t-purple-400 rounded-full animate-spin" />
        <span>Loading daily streak progress...</span>
      </div>
    )
  }

  const currentStreak = streak?.current_streak || 1
  const maxStreak = streak?.max_streak || 1
  const torusCount = Math.floor(currentStreak / 30)
  const daysInCycle = currentStreak % 30
  const progressPercent = Math.round((daysInCycle / 30) * 100)

  return (
    <Link href="/badges" className="block group">
      <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/5 group-hover:border-purple-500/40 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Flame size={18} className="fill-amber-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span>{currentStreak} Day Build Streak</span>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {daysInCycle} of 30 days towards next Torus Badge (Best: {maxStreak}d)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
            <span>View All Badges</span>
            <TrendingUp size={14} />
          </div>
        </div>

        {/* Progress Bar towards next Torus Milestone */}
        <div className="w-full bg-neutral-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(progressPercent, 12)}%` }}
          />
        </div>
      </div>
    </Link>
  )
}
