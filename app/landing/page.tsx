import Link from 'next/link'

export const metadata = {
  title: 'Torus AI — Landing',
  description: 'AI-powered project planning. Build anything, ship everything with Torus AI.'
}

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '56px 20px', display: 'flex', justifyContent: 'center', background: 'linear-gradient(180deg,#eef3f4 0%, #f8fafc 100%)' }}>
      <main style={{ width: '100%', maxWidth: '1100px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,#0f766e,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>T</div>
            <h1 style={{ fontSize: 20, margin: 0, fontFamily: 'Syne, sans-serif' }}>TorusAI</h1>
          </div>
          <nav>
            <Link href="/login" style={{ marginRight: 12, color: '#374151', textDecoration: 'none' }}>Log in</Link>
            <Link href="/signup" style={{ background: 'linear-gradient(135deg,#0f766e,#0891b2)', color: '#fff', padding: '8px 14px', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Get started</Link>
          </nav>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 36, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 44, margin: '0 0 12px', lineHeight: 1.02 }}>Build faster with AI-powered plans</h2>
            <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 20 }}>TorusAI generates production-ready architecture, phased plans, and curated tooling so you can ship features with confidence.</p>

            <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
              <Link href="/planner" style={{ padding: '12px 18px', background: '#0f766e', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700 }}>Generate a Plan</Link>
              <Link href="/badges" style={{ padding: '12px 18px', borderRadius: 12, border: '1px solid rgba(15,118,110,.08)', textDecoration: 'none', color: '#374151' }}>View Badges</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, maxWidth: 560 }}>
              <div style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 6px 20px rgba(16,24,40,0.04)' }}>
                <strong>AI Plans</strong>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Phase-by-phase architecture and code-ready specs.</div>
              </div>
              <div style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 6px 20px rgba(16,24,40,0.04)' }}>
                <strong>Team Tools</strong>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Collaborate, track progress, and hand off deliverables.</div>
              </div>
              <div style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 6px 20px rgba(16,24,40,0.04)' }}>
                <strong>Streaks & Badges</strong>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Earn Torus badges for consistency and milestones.</div>
              </div>
              <div style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 6px 20px rgba(16,24,40,0.04)' }}>
                <strong>Integrations</strong>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Use the tools you already love: Supabase, Vercel, and more.</div>
              </div>
            </div>
          </div>

          <aside style={{ background: 'linear-gradient(180deg,#0e1720,#0b1220)', color: '#fff', borderRadius: 16, padding: 20 }}>
            <h3 style={{ marginTop: 0 }}>Torus in action</h3>
            <div style={{ fontSize: 13, color: '#cbd5e1' }}>Generate a full-stack plan in minutes and export a starter project scaffold.</div>
            <div style={{ marginTop: 18 }}>
              <img alt="screenshot" src="/response.json" style={{ width: '100%', borderRadius: 10, opacity: 0.95 }} />
            </div>
          </aside>
        </section>

        <footer style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid rgba(15,23,42,0.04)', color: '#6b7280' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>© {new Date().getFullYear()} TorusAI</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/privacy" style={{ color: '#6b7280' }}>Privacy</Link>
              <Link href="/terms" style={{ color: '#6b7280' }}>Terms</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
