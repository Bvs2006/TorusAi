import Link from 'next/link'

export const metadata = {
  title: 'Torus AI - Landing',
  description: 'AI-powered project planning. Build anything, ship everything with Torus AI.'
}

type TorusShapeProps = {
  size: number
  thickness: number
  left?: string
  right?: string
  top?: string
  bottom?: string
  duration: number
  delay: number
  reverse?: boolean
  tint: string
}

function TorusShape({
  size,
  thickness,
  left,
  right,
  top,
  bottom,
  duration,
  delay,
  reverse = false,
  tint,
}: TorusShapeProps) {
  return (
    <div
      className="landing-torus-shell"
      style={{
        width: size,
        height: size,
        left,
        right,
        top,
        bottom,
      }}
    >
      <div
        className={`landing-torus ${reverse ? 'landing-torus-reverse' : ''}`}
        style={{
          borderWidth: thickness,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          background: tint,
        }}
      />
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-glow landing-glow-top" />
      <div className="landing-glow landing-glow-side" />

      <TorusShape
        size={520}
        thickness={56}
        right="-150px"
        top="-120px"
        duration={34}
        delay={-4}
        reverse
        tint="radial-gradient(circle, rgba(249,115,22,0.14) 0%, transparent 68%)"
      />
      <TorusShape
        size={380}
        thickness={42}
        left="-110px"
        top="90px"
        duration={24}
        delay={-10}
        tint="radial-gradient(circle, rgba(15,118,110,0.16) 0%, transparent 72%)"
      />
      <TorusShape
        size={250}
        thickness={28}
        right="18%"
        bottom="40px"
        duration={20}
        delay={-7}
        tint="radial-gradient(circle, rgba(8,145,178,0.16) 0%, transparent 72%)"
      />
      <TorusShape
        size={180}
        thickness={20}
        left="18%"
        bottom="-30px"
        duration={18}
        delay={-2}
        reverse
        tint="radial-gradient(circle, rgba(15,118,110,0.12) 0%, transparent 72%)"
      />

      <main className="landing-shell">
        <header className="landing-header">
          <div className="landing-brand">
            <div className="landing-logo">T</div>
            <h1>TorusAI</h1>
          </div>
          <nav className="landing-nav">
            <Link href="/login">Log in</Link>
            <Link href="/signup" className="landing-nav-cta">Get started</Link>
          </nav>
        </header>

        <section className="landing-hero">
          <div className="landing-copy">
            <div className="landing-kicker">AI planning workspace</div>
            <h2>Build faster with AI-powered plans</h2>
            <p>
              TorusAI generates production-ready architecture, phased execution plans, and curated tooling so teams can move from idea to launch with less drag.
            </p>

            <div className="landing-actions">
              <Link href="/planner" className="landing-primary-action">Generate a Plan</Link>
              <Link href="/badges" className="landing-secondary-action">View Badges</Link>
            </div>

            <div className="landing-metrics">
              <div>
                <strong>4-step</strong>
                <span>planning flow</span>
              </div>
              <div>
                <strong>30+</strong>
                <span>tool signals</span>
              </div>
              <div>
                <strong>1 hub</strong>
                <span>for delivery</span>
              </div>
            </div>

            <div className="landing-feature-grid">
              <article>
                <strong>AI Plans</strong>
                <span>Phase-by-phase architecture and code-ready specs.</span>
              </article>
              <article>
                <strong>Team Tools</strong>
                <span>Collaborate, track progress, and hand off deliverables.</span>
              </article>
              <article>
                <strong>Streaks & Badges</strong>
                <span>Earn Torus badges for consistency and milestones.</span>
              </article>
              <article>
                <strong>Integrations</strong>
                <span>Use the tools you already love: Supabase, Vercel, and more.</span>
              </article>
            </div>
          </div>

          <aside className="landing-console">
            <div className="landing-console-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="landing-console-content">
              <p className="landing-console-label">Torus in action</p>
              <h3>From rough idea to launch map</h3>
              <div className="landing-sequence">
                <div>
                  <b>01</b>
                  <span>Capture the product idea</span>
                </div>
                <div>
                  <b>02</b>
                  <span>Generate architecture and phases</span>
                </div>
                <div>
                  <b>03</b>
                  <span>Ship with guided prompts</span>
                </div>
              </div>
              <div className="landing-console-card">
                <span>Latest plan</span>
                <strong>AI sprint planner with auth, dashboards, and deployment steps</strong>
              </div>
            </div>
          </aside>
        </section>

        <footer className="landing-footer">
          <div>Copyright {new Date().getFullYear()} TorusAI</div>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </footer>
      </main>

      <style>{`
        .landing-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 56px 20px;
          background:
            linear-gradient(180deg, #eef3f4 0%, #f8fafc 100%);
          color: #172326;
        }

        .landing-shell {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1160px;
          margin: 0 auto;
        }

        .landing-glow {
          position: absolute;
          pointer-events: none;
          border-radius: 999px;
          filter: blur(8px);
        }

        .landing-glow-top {
          top: -180px;
          left: 50%;
          width: 760px;
          height: 760px;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(8,145,178,0.14) 0%, transparent 62%);
        }

        .landing-glow-side {
          right: -120px;
          bottom: -180px;
          width: 540px;
          height: 540px;
          background: radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%);
        }

        .landing-torus-shell {
          position: absolute;
          z-index: 1;
          pointer-events: none;
          perspective: 1200px;
        }

        .landing-torus {
          width: 100%;
          height: 100%;
          border-style: solid;
          border-color: rgba(24,45,56,0.12);
          border-radius: 50%;
          opacity: 0.82;
          animation-name: landing-spin;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          box-shadow:
            inset 0 18px 40px rgba(255,255,255,0.38),
            inset 0 -18px 40px rgba(15,23,42,0.08),
            0 28px 60px rgba(15,23,42,0.08);
        }

        .landing-torus-reverse {
          animation-name: landing-spin-reverse;
        }

        .landing-header,
        .landing-footer,
        .landing-console,
        .landing-feature-grid article,
        .landing-metrics div {
          backdrop-filter: blur(18px);
        }

        .landing-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 42px;
          padding: 14px 16px;
          border: 1px solid rgba(38,69,72,0.1);
          border-radius: 16px;
          background: rgba(255,255,255,0.68);
          box-shadow: 0 20px 60px rgba(15,23,42,0.05);
        }

        .landing-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .landing-brand h1 {
          margin: 0;
          font-size: 22px;
          font-family: Syne, sans-serif;
          letter-spacing: 0;
        }

        .landing-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          color: #fff;
          font-weight: 800;
          background: linear-gradient(135deg, #0f766e, #0891b2);
          box-shadow: 0 16px 30px rgba(8,145,178,0.24);
        }

        .landing-nav {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .landing-nav a,
        .landing-footer a {
          color: #374151;
          text-decoration: none;
        }

        .landing-nav-cta,
        .landing-primary-action {
          color: #fff !important;
          background: linear-gradient(135deg, #0f766e, #0891b2);
          box-shadow: 0 14px 30px rgba(8,145,178,0.18);
        }

        .landing-nav-cta {
          padding: 10px 16px;
          border-radius: 10px;
          font-weight: 700;
        }

        .landing-hero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 420px;
          gap: 40px;
          align-items: center;
        }

        .landing-kicker {
          display: inline-flex;
          margin-bottom: 18px;
          padding: 7px 12px;
          border: 1px solid rgba(15,118,110,0.14);
          border-radius: 999px;
          background: rgba(255,255,255,0.58);
          color: #0f766e;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0;
        }

        .landing-copy h2 {
          max-width: 720px;
          margin: 0 0 16px;
          font-family: Syne, sans-serif;
          font-size: 60px;
          line-height: 0.98;
          letter-spacing: 0;
        }

        .landing-copy p {
          max-width: 650px;
          margin-bottom: 24px;
          color: #607276;
          font-size: 17px;
          line-height: 1.65;
        }

        .landing-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 26px;
          flex-wrap: wrap;
        }

        .landing-primary-action,
        .landing-secondary-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 18px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 700;
        }

        .landing-secondary-action {
          border: 1px solid rgba(15,118,110,0.14);
          color: #374151;
          background: rgba(255,255,255,0.62);
        }

        .landing-metrics {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 18px;
          max-width: 620px;
        }

        .landing-metrics div,
        .landing-feature-grid article {
          border: 1px solid rgba(38,69,72,0.1);
          background: rgba(255,255,255,0.68);
          box-shadow: 0 14px 40px rgba(15,23,42,0.04);
        }

        .landing-metrics div {
          border-radius: 12px;
          padding: 16px;
        }

        .landing-metrics strong,
        .landing-metrics span {
          display: block;
        }

        .landing-metrics strong {
          font-size: 24px;
          font-family: Syne, sans-serif;
        }

        .landing-metrics span {
          margin-top: 4px;
          color: #607276;
          font-size: 13px;
        }

        .landing-feature-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          max-width: 720px;
        }

        .landing-feature-grid article {
          display: grid;
          gap: 6px;
          padding: 18px;
          border-radius: 14px;
        }

        .landing-feature-grid strong {
          font-size: 15px;
        }

        .landing-feature-grid span {
          color: #607276;
          font-size: 13px;
          line-height: 1.5;
        }

        .landing-console {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 22px;
          background: linear-gradient(180deg, rgba(14,23,32,0.96), rgba(11,18,32,0.96));
          color: #fff;
          box-shadow: 0 28px 70px rgba(15,23,42,0.18);
          overflow: hidden;
        }

        .landing-console-bar {
          display: flex;
          gap: 8px;
          padding: 16px 18px 0;
        }

        .landing-console-bar span {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.22);
        }

        .landing-console-content {
          padding: 18px;
        }

        .landing-console-label {
          margin: 0 0 8px;
          color: #99f6e4 !important;
          font-size: 12px !important;
          font-weight: 700;
          text-transform: uppercase;
        }

        .landing-console h3 {
          margin: 0 0 18px;
          font-size: 28px;
          line-height: 1.15;
          font-family: Syne, sans-serif;
        }

        .landing-sequence {
          display: grid;
          gap: 12px;
          margin-bottom: 18px;
        }

        .landing-sequence div,
        .landing-console-card {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          background: rgba(255,255,255,0.06);
        }

        .landing-sequence div {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 12px;
          align-items: center;
          padding: 14px;
        }

        .landing-sequence b {
          color: #67e8f9;
          font-family: Syne, sans-serif;
        }

        .landing-sequence span {
          color: #e2e8f0;
          line-height: 1.45;
        }

        .landing-console-card {
          display: grid;
          gap: 8px;
          padding: 16px;
        }

        .landing-console-card span {
          color: #94a3b8;
          font-size: 12px;
          text-transform: uppercase;
        }

        .landing-console-card strong {
          line-height: 1.5;
          font-size: 15px;
        }

        .landing-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-top: 56px;
          padding-top: 28px;
          border-top: 1px solid rgba(15,23,42,0.06);
          color: #607276;
        }

        .landing-footer div:last-child {
          display: flex;
          gap: 14px;
        }

        @keyframes landing-spin {
          0% { transform: rotateX(58deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(58deg) rotateY(360deg) rotateZ(360deg); }
        }

        @keyframes landing-spin-reverse {
          0% { transform: rotateX(-58deg) rotateY(360deg) rotateZ(360deg); }
          100% { transform: rotateX(-58deg) rotateY(0deg) rotateZ(0deg); }
        }

        @media (max-width: 980px) {
          .landing-page {
            padding-top: 24px;
          }

          .landing-hero {
            grid-template-columns: 1fr;
          }

          .landing-copy h2 {
            font-size: 48px;
          }

          .landing-console {
            max-width: 560px;
          }

          .landing-torus-shell:nth-of-type(4) {
            opacity: 0.55;
          }
        }

        @media (max-width: 720px) {
          .landing-header,
          .landing-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .landing-copy h2 {
            font-size: 38px;
          }

          .landing-copy p {
            font-size: 16px;
          }

          .landing-metrics,
          .landing-feature-grid {
            grid-template-columns: 1fr;
          }

          .landing-console h3 {
            font-size: 24px;
          }

          .landing-torus-shell {
            transform: scale(0.78);
            transform-origin: center;
          }
        }
      `}</style>
    </div>
  )
}
