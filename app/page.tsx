import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  Sparkles,
  Code2,
  Rocket,
  ArrowRight,
  BrainCircuit,
  Wrench
} from 'lucide-react'

const TorusShape = ({ size, color, thickness, left, top, right, bottom, delay, duration, reverse }: any) => (
  <div 
    className="torus-shape"
    style={{
      position: 'absolute',
      left, top, right, bottom,
      width: size, height: size,
      border: `${thickness}px solid ${color}`,
      borderRadius: '50%',
      animation: `${reverse ? 'rotate3d-reverse' : 'rotate3d'} ${duration}s linear infinite`,
      animationDelay: `${delay}s`,
      opacity: 0.4,
      zIndex: 0,
      pointerEvents: 'none',
      boxShadow: `inset 0 15px 30px rgba(0,0,0,0.04), 0 15px 30px rgba(0,0,0,0.04)`
    }}
  />
)

export default async function LandingPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('fb_session')?.value
  if (session) redirect('/dashboard')

  return (
    <div style={{ minHeight: '100vh', background: '#eef3f4', color: '#172326', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(38,69,72,.08)', background: 'rgba(238,243,244,0.8)', backdropFilter: 'blur(16px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: '72px', padding: '0 24px' }}>
          
          {/* Left: Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '24px', fontWeight: 800, fontFamily: 'Syne, sans-serif', letterSpacing: '-1px' }}>
            Torus<span style={{ color: '#5aa0a4' }}>AI</span>
          </div>
          
          {/* Center: Nav Links */}
          <div className="nav-links-container" style={{ alignItems: 'center', gap: '32px', justifyContent: 'center' }}>
            <Link href="/" className="nav-link" style={{ fontSize: '14px', fontWeight: 600, color: '#607276', textDecoration: 'none', transition: 'color 0.2s', fontFamily: 'DM Sans, sans-serif' }}>Home</Link>
            <Link href="#features" className="nav-link" style={{ fontSize: '14px', fontWeight: 600, color: '#607276', textDecoration: 'none', transition: 'color 0.2s', fontFamily: 'DM Sans, sans-serif' }}>Features</Link>
            <Link href="/tools" className="nav-link" style={{ fontSize: '14px', fontWeight: 600, color: '#607276', textDecoration: 'none', transition: 'color 0.2s', fontFamily: 'DM Sans, sans-serif' }}>Tool Hub</Link>
          </div>

          {/* Right: Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'flex-end' }}>
            <Link
              href="/login"
              className="login-link"
              style={{ fontSize: '14px', fontWeight: 700, color: '#607276', textDecoration: 'none', transition: 'color 0.2s', fontFamily: 'Syne, sans-serif' }}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              style={{
                display: 'inline-flex', alignItems: 'center', height: '40px', padding: '0 20px',
                background: 'linear-gradient(135deg, #365f62, #83b9bd)', borderRadius: '10px',
                fontSize: '14px', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#fff', textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(66,127,131,0.25)'
              }}
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-150px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(131,185,189,0.15) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
        
        {/* Floating Torus Backgrounds */}
        <TorusShape size={300} thickness={40} color="rgba(90,160,164,0.15)" left="-100px" top="50px" delay={0} duration={20} />
        <TorusShape size={450} thickness={60} color="rgba(66,127,131,0.1)" right="-150px" top="-50px" delay={-5} duration={35} reverse={true} />
        <TorusShape size={200} thickness={25} color="rgba(16,185,129,0.1)" left="20%" bottom="-50px" delay={-12} duration={25} />
        <TorusShape size={120} thickness={16} color="rgba(90,160,164,0.2)" right="25%" top="180px" delay={-2} duration={15} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '120px 24px 100px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(38,69,72,.12)', borderRadius: '20px', fontSize: '12px', fontFamily: 'DM Mono, monospace', fontWeight: 600, color: '#607276', marginBottom: '28px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <Sparkles size={14} color="#5aa0a4" />
            The Ultimate Developer Workspace
          </div>
          
          <h1 style={{ fontSize: '64px', fontWeight: 800, fontFamily: 'Syne, sans-serif', lineHeight: 1.1, letterSpacing: '-1.5px', margin: '0 0 24px', color: '#172326' }}>
            Architect your next app <br />
            <span style={{ color: '#5aa0a4' }}>
              in minutes, not days.
            </span>
          </h1>
          
          <p style={{ fontSize: '18px', color: '#607276', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            Convert raw ideas into structured blueprints, generate AI prompts, follow step-by-step architecture guides, and deploy seamlessly.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <Link
              href="/signup"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px', height: '56px', padding: '0 36px',
                background: 'linear-gradient(135deg, #365f62, #83b9bd)', color: '#fff', borderRadius: '14px', fontSize: '16px', fontWeight: 800,
                fontFamily: 'Syne, sans-serif', textDecoration: 'none', transition: 'transform 0.2s', boxShadow: '0 8px 24px rgba(66,127,131,0.25)'
              }}
            >
              Start Building <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              style={{
                display: 'inline-flex', alignItems: 'center', height: '56px', padding: '0 36px',
                background: 'rgba(255,255,255,0.6)', color: '#172326', border: '1px solid rgba(38,69,72,.12)',
                borderRadius: '14px', fontSize: '16px', fontWeight: 700, fontFamily: 'Syne, sans-serif', textDecoration: 'none'
              }}
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 120px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              { icon: BrainCircuit, title: 'Idea Analyzer', desc: 'Type what you want to build. Torus AI instantly generates a complete tech stack and workflow.' },
              { icon: Code2, title: 'Step-by-Step Architecture', desc: 'Get a distraction-free, actionable guide for every phase of your project, with exact AI prompts.' },
              { icon: Wrench, title: 'Error Fix Assistant', desc: 'Hit a bug? Paste your terminal output and our AI Bot will explain the error and provide the fix.' },
              { icon: Rocket, title: 'Deploy with Confidence', desc: 'Project-aware deployment guides that recommend the best platform and give you the CLI commands.' },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} style={{ padding: '36px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(38,69,72,.08)', borderRadius: '24px', boxShadow: '0 8px 32px rgba(16,24,40,0.02)' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(66,127,131,.1), rgba(16,185,129,.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#427f83', border: '1px solid rgba(66,127,131,.15)' }}>
                    <Icon size={26} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'Syne, sans-serif', margin: '0 0 12px', color: '#172326' }}>{feature.title}</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#607276', lineHeight: 1.6 }}>{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid rgba(38,69,72,.1)', padding: '40px 24px', textAlign: 'center', color: '#8a9a9d', fontSize: '13px', fontFamily: 'DM Mono, monospace' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px', fontSize: '16px', fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#172326' }}>
          Torus<span style={{ color: '#5aa0a4' }}>AI</span>
        </div>
        © {new Date().getFullYear()} Torus AI Workspace. All rights reserved.
      </footer>
      <style>{`
        .nav-link:hover, .login-link:hover { color: #172326 !important; }
        .nav-links-container { display: flex; }
        @media (max-width: 768px) {
          .nav-links-container { display: none !important; }
        }
        html { scroll-behavior: smooth; }
        @keyframes rotate3d {
          0% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: perspective(1000px) rotateX(360deg) rotateY(180deg) rotateZ(360deg); }
        }
        @keyframes rotate3d-reverse {
          0% { transform: perspective(1000px) rotateX(360deg) rotateY(180deg) rotateZ(360deg); }
          100% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
        }
      `}</style>
    </div>
  )
}
