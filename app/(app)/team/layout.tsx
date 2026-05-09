import { LeftSidebar } from '@/components/team/LeftSidebar'
import { RightPanel } from '@/components/team/RightPanel'
import { TeamProvider } from './TeamContext'

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <TeamProvider>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr 320px',
        height: '100vh',
        background: '#09090b', // Dark OS theme
        color: '#e5e7eb',
        fontFamily: 'DM Sans, sans-serif',
        overflow: 'hidden'
      }}>
        {/* Left Panel */}
        <LeftSidebar />

        {/* Center Canvas */}
        <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          {children}
        </div>

        {/* Right Context Panel */}
        <RightPanel />
      </div>
    </TeamProvider>
  )
}
