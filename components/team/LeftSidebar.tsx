"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTeam } from '@/app/(app)/team/TeamContext'
import { ChevronDown, Wrench, Search, Book, Clock, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

export function LeftSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { projects, activeProject, setActiveProjectById, activeRole, setActiveRole } = useTeam()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const NAV = [
    { name: 'AI Tools', icon: Wrench, href: '/team/tools' },
    { name: 'Prompts', icon: Search, href: '/team/prompts' },
    { name: 'Documentation', icon: Book, href: '/team/docs' },
  ]

  return (
    <div style={{
      width: isCollapsed ? '72px' : '220px', background: 'rgba(17,18,20,0.85)', backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px',
      margin: '24px 0 24px 24px', padding: '16px 8px',
      display: 'flex', flexDirection: 'column', height: 'fit-content', maxHeight: 'calc(100vh - 48px)',
      color: '#a0a5ab', fontFamily: 'DM Sans, sans-serif',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)', zIndex: 10,
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      {/* Collapse Toggle */}
      <div style={{ display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-end', padding: '0 8px 12px' }}>
        <button onClick={() => setIsCollapsed(!isCollapsed)} style={{
          background: 'transparent', border: 'none', color: '#565b63', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px',
          borderRadius: '8px', transition: 'all 0.2s'
        }} onMouseOver={e => e.currentTarget.style.color = '#e5e7eb'} onMouseOut={e => e.currentTarget.style.color = '#565b63'}>
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Nav Menu */}
      <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto', overflowX: 'hidden' }}>
        {NAV.map(item => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/team')
          return (
            <Link key={item.name} href={item.href} title={isCollapsed ? item.name : undefined} style={{
              display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '12px', padding: '10px',
              borderRadius: '999px', textDecoration: 'none',
              color: isActive ? '#fff' : '#a0a5ab',
              background: isActive ? '#1a1b1e' : 'transparent',
              fontSize: '13px', fontWeight: isActive ? 600 : 500, transition: 'all 0.2s'
            }}>
              <item.icon size={18} color={isActive ? '#e5e7eb' : '#565b63'} style={{ flexShrink: 0 }} />
              {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.name}</span>}
            </Link>
          )
        })}

        {/* Recent Projects Section */}
        <div style={{ marginTop: '24px', paddingBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: '6px', padding: isCollapsed ? '0' : '0 12px', marginBottom: '8px', color: '#565b63' }} title={isCollapsed ? "Recent Projects" : undefined}>
            <Clock size={14} style={{ flexShrink: 0 }} /> 
            {!isCollapsed && <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recent</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {projects.map((p: any) => {
              const isActive = p.id === activeProject?.id
              return (
                <button key={p.id} title={isCollapsed ? p.name : undefined} onClick={() => { setActiveProjectById(p.id); router.push('/team/workflow') }} style={{
                  display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start',
                  padding: '8px 10px', background: isActive ? '#1a1b1e' : 'transparent',
                  border: 'none', borderRadius: '999px', cursor: 'pointer', textAlign: 'left',
                  color: isActive ? '#3b82f6' : '#a0a5ab', transition: 'all 0.2s'
                }}>
                  {isCollapsed ? (
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: isActive ? 'rgba(59,130,246,0.2)' : '#1e1f23', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800, flexShrink: 0 }}>{p.name[0].toUpperCase()}</div>
                  ) : (
                    <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Roles Section */}
        {activeProject && activeProject.required_roles && (
          <div style={{ marginTop: '16px', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: '6px', padding: isCollapsed ? '0' : '0 12px', marginBottom: '8px', color: '#565b63' }} title={isCollapsed ? "Team Members" : undefined}>
              <ChevronDown size={14} style={{ flexShrink: 0 }} /> 
              {!isCollapsed && <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Members</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {activeProject.required_roles.map((role: any) => {
                const isActive = activeRole === role.title
                return (
                  <button key={role.title} title={isCollapsed ? `${role.title} (${role.progress}%)` : undefined} onClick={() => setActiveRole(role.title)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between',
                    padding: '8px 10px', background: isActive ? '#1a1b1e' : 'transparent',
                    border: 'none', borderRadius: '999px', cursor: 'pointer', textAlign: 'left',
                    color: isActive ? '#fff' : '#a0a5ab', transition: 'all 0.2s'
                  }}>
                    {isCollapsed ? (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: role.status === 'done' ? '#10b981' : role.status === 'active' ? '#3b82f6' : '#3f3f46', flexShrink: 0 }} />
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: role.status === 'done' ? '#10b981' : role.status === 'active' ? '#3b82f6' : '#3f3f46', flexShrink: 0 }} />
                          <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>{role.title}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#565b63', fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>{role.progress}%</span>
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
