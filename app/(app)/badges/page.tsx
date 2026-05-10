'use client'

import { Trophy, Star, Zap, Code, Shield, Flame } from 'lucide-react'
import { useEffect, useState } from 'react'
import TorusStreak from '@/components/TorusStreak'

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

const BADGES = [
  { id: 'first_project', title: 'First Project', description: 'Created your first AI project on Torus.', icon: Star, unlocked: true, color: '#f59e0b' },
  { id: 'architect', title: 'Code Architect', description: 'Successfully generated a system blueprint.', icon: Code, unlocked: true, color: '#3b82f6' },
  { id: 'power_user', title: 'Power User', description: 'Spent over 10 hours in the Vibe Workspace.', icon: Zap, unlocked: false, color: '#8b5cf6' },
  { id: 'defender', title: 'Defender', description: 'Fixed 5 errors using the Robot Fixer.', icon: Shield, unlocked: false, color: '#10b981' },
]

export default function BadgesPage() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        // Get current user ID from auth
        const { data: { user } } = await (await import('@supabase/supabase-js')).createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        ).auth.getUser()

        if (!user?.id) {
          setError('User not authenticated')
          return
        }

        const response = await fetch(`/api/streaks/get?user_id=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setStreakData(data)
        } else {
          setError('Failed to load streak data')
        }
      } catch (err) {
        console.error('Error fetching streak data:', err)
        setError('Error loading streak information')
      } finally {
        setLoading(false)
      }
    }

    fetchStreakData()
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
      {!loading && streakData && (
        <div style={{ marginBottom: '40px' }}>
          <TorusStreak streak={streakData.streak} badges={streakData.badges} />
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#8a9a9d' }}>
          <p>Loading streak information...</p>
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

      {/* Achievement Badges */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: '#fff' }}>Achievements</h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px'
        }}>
          {BADGES.map(badge => {
            const Icon = badge.icon
            return (
              <div key={badge.id} style={{
                background: '#0e0c1a', border: '1px solid rgba(38,69,72,.1)',
                borderRadius: '20px', padding: '28px',
                display: 'flex', gap: '20px',
                opacity: badge.unlocked ? 1 : 0.6,
                transition: 'all 0.2s ease',
                cursor: 'default',
                boxShadow: badge.unlocked ? '0 4px 20px rgba(0,0,0,0.2)' : 'none'
              }}
                onMouseOver={e => { if (badge.unlocked) e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseOut={e => { if (badge.unlocked) e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0,
                  background: badge.unlocked ? `${badge.color}15` : 'rgba(255,255,255,.62)',
                  border: badge.unlocked ? `1px solid ${badge.color}30` : '1px solid #2d2b3b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: badge.unlocked ? badge.color : '#8a9a9d',
                  boxShadow: badge.unlocked ? `0 0 20px ${badge.color}20` : 'none'
                }}>
                  <Icon size={28} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: badge.unlocked ? '#fff' : '#607276', marginBottom: '6px' }}>
                    {badge.title}
                  </div>
                  <div style={{ fontSize: '14px', color: '#8a9a9d', lineHeight: 1.5 }}>
                    {badge.description}
                  </div>
                  {badge.unlocked ? (
                    <div style={{ marginTop: '16px', fontSize: '12px', fontWeight: 700, color: badge.color, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: badge.color }} />
                      Unlocked
                    </div>
                  ) : (
                    <div style={{ marginTop: '16px', fontSize: '12px', fontWeight: 600, color: '#3a3360', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Locked
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

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
