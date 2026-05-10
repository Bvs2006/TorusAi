'use client'

import { Trophy, Flame } from 'lucide-react'
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

const TORUS_BADGE_META: Record<string, { label: string; color: string }> = {
  '1_month': { label: '1 Month', color: '#60a5fa' },
  '3_months': { label: '3 Months', color: '#8b5cf6' },
  '6_months': { label: '6 Months', color: '#ec4899' },
  '12_months': { label: '1 Year', color: '#f59e0b' },
  '24_months': { label: '2 Years', color: '#ef4444' },
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
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', color: '#172326' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px',
          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)'
        }}>
          <Trophy size={28} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, fontFamily: 'Syne, sans-serif', letterSpacing: '-0.5px' }}>Your Badges & Streaks</h1>
          <p style={{ color: '#607276', margin: '6px 0 0', fontSize: '15px' }}>Complete milestones, maintain streaks, and unlock achievements in your Torus journey.</p>
        </div>
      </div>

      {/* Streak Section */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#8a9a9d' }}>
          <p>Loading streak information...</p>
        </div>
      )}

      {!loading && streakData && (
        <div style={{ marginBottom: '40px' }}>
          <TorusStreak streak={streakData.streak} badges={streakData.badges} />
        </div>
      )}

      {error && (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '40px',
          color: '#ef4444'
        }}>
          {error}
        </div>
      )}

      {!loading && streakData?.badges?.length ? (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: '#172326' }}>Torus Badges</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {streakData.badges.map(badge => {
              const meta = TORUS_BADGE_META[badge.badge_type] || { label: badge.badge_type, color: '#8b5cf6' }
              return (
                <div key={badge.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px',
                  borderRadius: '18px',
                  background: `linear-gradient(135deg, ${meta.color}16, rgba(14, 12, 26, 0.96))`,
                  border: `1px solid ${meta.color}40`,
                  boxShadow: `0 12px 32px ${meta.color}14`
                }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: `conic-gradient(from 0deg, ${meta.color}, ${meta.color}80, ${meta.color})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: `0 0 18px ${meta.color}40`
                  }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: '#0e0c1a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: meta.color,
                      fontSize: '11px',
                      fontWeight: 800
                    }}>
                      {meta.label.replace('Month', 'M')}
                    </div>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{meta.label} Torus</div>
                    <div style={{ fontSize: '12px', color: '#8a9a9d', marginTop: '4px' }}>
                      Earned on {new Date(badge.earned_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      {/* Streak Information */}
      <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Flame size={20} color="#8b5cf6" />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>About Streaks</h3>
        </div>
        <ul style={{ margin: 0, paddingLeft: '24px', color: '#8a9a9d', lineHeight: '1.8' }}>
          <li>🟦 <strong>Torus Badges</strong>: One torus badge earned for every 30 consecutive days of activity</li>
          <li>⭐ <strong>Milestone Badges</strong>: Special badges unlocked at 1, 3, 6, 12, and 24 month streaks</li>
          <li>🔥 <strong>Streaks</strong>: Activity on at least one day per day keeps your streak alive</li>
          <li>⚠️ <strong>Streak Reset</strong>: Miss a day and your streak resets to 0 - start a new one!</li>
          <li>📊 <strong>Activities That Count</strong>: Creating projects, adding features, completing phases, and more</li>
        </ul>
      </div>
    </div>
  )
}
