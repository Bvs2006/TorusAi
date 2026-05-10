'use client'

import { Flame, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

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
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await fetch(`/api/streaks/get?user_id=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setStreak(data.streak)

          // Check if streak is active
          const lastActivityDate = new Date(data.streak.last_activity_date)
          const today = new Date()
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)

          const lastActivityDateOnly = new Date(lastActivityDate).toDateString()
          const todayOnly = today.toDateString()
          const yesterdayOnly = yesterday.toDateString()

          setIsActive(lastActivityDateOnly === todayOnly || lastActivityDateOnly === yesterdayOnly)
        }
      } catch (error) {
        console.error('Error fetching streak:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStreak()
  }, [userId])

  if (loading || !streak) {
    return null
  }

  const torusCount = Math.floor(streak.current_streak / 30)
  const remainingDays = streak.current_streak % 30

  return (
    <a href="/badges" style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          background: isActive
            ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(139, 92, 246, 0.1))'
            : 'rgba(100, 116, 139, 0.05)',
          border: isActive
            ? '1px solid rgba(249, 115, 22, 0.3)'
            : '1px solid rgba(100, 116, 139, 0.2)',
          borderRadius: '16px',
          padding: '20px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: isActive ? '0 4px 12px rgba(249, 115, 22, 0.1)' : 'none'
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(249, 115, 22, 0.15)'
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = isActive ? '0 4px 12px rgba(249, 115, 22, 0.1)' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={20} color={isActive ? '#f97316' : '#64748b'} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
              {streak.current_streak} Day Streak
            </span>
          </div>
          <TrendingUp size={18} color={isActive ? '#f97316' : '#64748b'} />
        </div>

        {/* Mini Torus Visualization */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {Array.from({ length: Math.min(torusCount, 3) }).map((_, i) => (
            <div
              key={`mini-torus-${i}`}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, #8b5cf6, #ec4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                boxShadow: '0 0 6px rgba(139, 92, 246, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              ⭕
            </div>
          ))}
          {torusCount > 3 && (
            <div style={{ fontSize: '11px', color: '#8a9a9d', display: 'flex', alignItems: 'center' }}>
              +{torusCount - 3} more
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ fontSize: '11px', color: '#8a9a9d' }}>
            Current: <span style={{ fontWeight: 600, color: '#f97316' }}>{streak.current_streak}d</span>
          </div>
          <div style={{ fontSize: '11px', color: '#8a9a9d' }}>
            Best: <span style={{ fontWeight: 600, color: '#8b5cf6' }}>{streak.max_streak}d</span>
          </div>
        </div>

        <div
          style={{
            marginTop: '12px',
            fontSize: '11px',
            fontWeight: 500,
            color: isActive ? '#f97316' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {isActive ? '🔥 Keep going!' : '⚠️ Streak ended'}
        </div>
      </div>
    </a>
  )
}
