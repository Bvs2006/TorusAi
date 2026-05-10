'use client'

import { Flame } from 'lucide-react'
import { useEffect, useState } from 'react'

interface TorusStreakProps {
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
}

export default function TorusStreak({ streak, badges }: TorusStreakProps) {
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    // Check if streak is still active (activity today or yesterday)
    const lastActivityDate = new Date(streak.last_activity_date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const lastActivityDateOnly = new Date(lastActivityDate).toDateString()
    const todayOnly = today.toDateString()
    const yesterdayOnly = yesterday.toDateString()

    setIsActive(lastActivityDateOnly === todayOnly || lastActivityDateOnly === yesterdayOnly)
  }, [streak.last_activity_date])

  const badgeConfig = {
    '1_month': { label: '1 Month', days: 30, color: '#60a5fa', icon: '🟦' },
    '3_months': { label: '3 Months', days: 90, color: '#8b5cf6', icon: '🟣' },
    '6_months': { label: '6 Months', days: 180, color: '#ec4899', icon: '🌸' },
    '12_months': { label: '1 Year', days: 365, color: '#f59e0b', icon: '⭐' },
    '24_months': { label: '2 Years', days: 730, color: '#ef4444', icon: '💎' }
  }

  const renderTorusShapes = () => {
    const torusCount = Math.floor(streak.current_streak / 30)
    const remainingDays = streak.current_streak % 30

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
        {/* Full month torus badges */}
        {Array.from({ length: torusCount }).map((_, i) => (
          <div
            key={`torus-${i}`}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: `conic-gradient(from 0deg, #8b5cf6, #ec4899, #f59e0b, #8b5cf6)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 0 12px rgba(139, 92, 246, 0.4)',
              position: 'relative',
              border: '2px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#0e0c1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ⭕
            </div>
          </div>
        ))}

        {/* Partial month torus (progress) */}
        {remainingDays > 0 && (
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: `conic-gradient(from 0deg, #8b5cf6 0deg, #8b5cf6 ${(remainingDays / 30) * 360}deg, #4b5563 ${(remainingDays / 30) * 360}deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              boxShadow: '0 0 8px rgba(139, 92, 246, 0.3)',
              position: 'relative',
              border: '2px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#0e0c1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: '#8b5cf6'
              }}
            >
              {remainingDays}d
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ background: '#0e0c1a', borderRadius: '20px', padding: '28px', border: '1px solid rgba(38,69,72,.1)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: isActive ? 'rgba(249, 115, 22, 0.2)' : 'rgba(100, 116, 139, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: isActive ? '2px solid #f97316' : '2px solid #64748b'
          }}
        >
          <Flame size={24} color={isActive ? '#f97316' : '#64748b'} />
        </div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff', margin: 0 }}>
            {streak.current_streak} Day Streak
          </div>
          <div style={{ fontSize: '13px', color: '#8a9a9d', margin: '4px 0 0' }}>
            {isActive ? '🔥 Keep it going!' : '⚠️ Streak broken - Start a new one!'}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '12px' }}>
          <div style={{ fontSize: '12px', color: '#8a9a9d', marginBottom: '4px' }}>Current Streak</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#f97316' }}>{streak.current_streak} days</div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '12px' }}>
          <div style={{ fontSize: '12px', color: '#8a9a9d', marginBottom: '4px' }}>Best Streak</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#8b5cf6' }}>{streak.max_streak} days</div>
        </div>
      </div>

      {/* Torus Visualization */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
          Your Torus Badges
        </div>
        {renderTorusShapes()}
      </div>

      {/* Milestone Badges */}
      {badges && badges.length > 0 && (
        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
            Milestone Badges Unlocked
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {badges.map(badge => {
              const config = badgeConfig[badge.badge_type as keyof typeof badgeConfig]
              return (
                <div
                  key={badge.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: `${config?.color}15`,
                    border: `1px solid ${config?.color}40`,
                    flex: '1 0 calc(50% - 6px)'
                  }}
                >
                  <div style={{ fontSize: '32px' }}>{config?.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: config?.color }}>
                    {config?.label}
                  </div>
                  <div style={{ fontSize: '10px', color: '#8a9a9d' }}>
                    Earned on {new Date(badge.earned_at).toLocaleDateString()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
