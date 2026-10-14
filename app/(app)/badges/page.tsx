'use client'

import { Trophy, Flame, Sparkles, Award, ShieldCheck, CheckCircle2, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import TorusStreak from '@/components/TorusStreak'
import { auth } from '@/utils/firebase/client'
import { onAuthStateChanged } from 'firebase/auth'

interface StreakData {
  streak: {
    current_streak: number
    max_streak: number
    last_activity_date: string
  }
  badges: Array<{
    id: string
    badge_type: string
    earned_at: string
    streak_value: number
  }>
  recentActivity: Array<{
    id: string
    activity_type: string
    activity_date: string
  }>
}

const TORUS_BADGE_META: Record<string, { label: string; color: string; desc: string }> = {
  '1_month': { label: '30-Day Pioneer', color: '#60a5fa', desc: '1 month of consistent software engineering' },
  '3_months': { label: 'Quarterly Builder', color: '#8b5cf6', desc: '90-day streak of active project planning' },
  '6_months': { label: 'Architect Master', color: '#ec4899', desc: 'Half a year of uninterrupted code execution' },
  '12_months': { label: 'Annual Legend', color: '#f59e0b', desc: '365 days of relentless building' },
  '24_months': { label: 'Torus Sovereign', color: '#ef4444', desc: '2 years of mastery on the Torus ecosystem' },
}

export default function BadgesPage() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      try {
        if (!user?.uid) {
          setError('User not authenticated')
          setStreakData(null)
          return
        }

        const response = await fetch(`/api/streaks/get?user_id=${user.uid}`)
        if (!response.ok) {
          setError('Failed to load streak data')
          setStreakData(null)
          return
        }

        const data = await response.json()
        setStreakData(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching streak data:', err)
        setError('Error loading streak information')
        setStreakData(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto text-neutral-900 dark:text-white/90 font-sans selection:bg-purple-500/30 selection:text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-[11px] font-mono text-purple-700 dark:text-purple-300 uppercase tracking-widest mb-3">
            <Trophy size={13} className="text-purple-500 dark:text-purple-400" />
            <span>Developer Achievements</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-normal text-neutral-900 dark:text-white tracking-tight">
            Your Badges & Streaks
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base mt-2">
            Complete milestones, sustain daily engineering momentum, and unlock radiant Torus badges.
          </p>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="text-center py-20 text-neutral-400 font-mono text-sm">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-3" />
          <span>Synchronizing streak telemetry...</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-4 rounded-2xl mb-8 text-sm font-mono">
          {error}
        </div>
      )}

      {/* Streak Visualization */}
      {!loading && streakData && (
        <div className="mb-12 bg-white dark:bg-[#0c0d15] border border-neutral-200/90 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-2xl">
          <TorusStreak streak={streakData.streak} badges={streakData.badges} />
        </div>
      )}

      {/* Badges Grid */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Award size={20} className="text-purple-500 dark:text-purple-400" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Torus Milestones</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(TORUS_BADGE_META).map(([type, meta]) => {
            const earned = streakData?.badges?.some(b => b.badge_type === type)
            return (
              <div
                key={type}
                className={`relative rounded-2xl p-6 border transition-all duration-300 flex items-center gap-5 ${
                  earned
                    ? 'bg-[#12131d] border-purple-500/40 shadow-lg shadow-purple-500/10'
                    : 'bg-[#0a0b10] border-white/[0.06] opacity-60'
                }`}
              >
                {/* Torus Ring Graphic */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 p-[2px]"
                  style={{
                    background: earned
                      ? `conic-gradient(from 0deg, ${meta.color}, ${meta.color}80, ${meta.color})`
                      : 'rgba(255,255,255,0.1)'
                  }}
                >
                  <div className="w-full h-full rounded-full bg-[#08080c] flex items-center justify-center">
                    <span className="font-mono text-xs font-bold" style={{ color: earned ? meta.color : '#888' }}>
                      {type.split('_')[0]}M
                    </span>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white truncate">{meta.label}</h3>
                    {earned && (
                      <span className="text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30">
                        Earned
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {meta.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Rules & Guidelines */}
      <div className="bg-[#0c0d15] border border-white/10 rounded-2xl p-6 sm:p-8 text-neutral-300 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 mb-4 text-purple-300 font-semibold text-base">
          <Flame size={18} />
          <span>Streak Mechanics & Verification</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-neutral-400">
          <div className="flex items-start gap-2 bg-white/[0.02] p-3 rounded-xl border border-white/5">
            <CheckCircle2 size={15} className="text-purple-400 shrink-0 mt-0.5" />
            <span>Actions that advance streaks: Generating plans, adding features, completing build phases, and fixing errors.</span>
          </div>
          <div className="flex items-start gap-2 bg-white/[0.02] p-3 rounded-xl border border-white/5">
            <Calendar size={15} className="text-cyan-400 shrink-0 mt-0.5" />
            <span>Daily cadence resets at midnight UTC. Log at least one development milestone per 24 hours.</span>
          </div>
        </div>
      </div>

    </div>
  )
}
