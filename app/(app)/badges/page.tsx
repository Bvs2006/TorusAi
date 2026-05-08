'use client'

import { Trophy, Star, Zap, Code, Shield } from 'lucide-react'

const BADGES = [
  { id: 'first_project', title: 'First Project', description: 'Created your first AI project on Torus.', icon: Star, unlocked: true, color: '#f59e0b' },
  { id: 'architect', title: 'Code Architect', description: 'Successfully generated a system blueprint.', icon: Code, unlocked: true, color: '#3b82f6' },
  { id: 'power_user', title: 'Power User', description: 'Spent over 10 hours in the Vibe Workspace.', icon: Zap, unlocked: false, color: '#8b5cf6' },
  { id: 'defender', title: 'Defender', description: 'Fixed 5 errors using the Robot Fixer.', icon: Shield, unlocked: false, color: '#10b981' },
]

export default function BadgesPage() {
  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', color: '#172326' }}>
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
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, fontFamily: 'Syne, sans-serif', letterSpacing: '-0.5px' }}>Your Badges</h1>
          <p style={{ color: '#607276', margin: '6px 0 0', fontSize: '15px' }}>Complete milestones and unlock achievements in your Torus journey.</p>
        </div>
      </div>

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
  )
}
