import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  Sparkles,
  Code2,
  Rocket,
  ArrowRight,
  BrainCircuit,
  Wrench,
  Users,
  Mail,
  Phone,
  Upload,
  Zap
} from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

const TorusShape = ({ size, color, thickness, left, top, right, bottom, delay, duration, reverse, gradient }: any) => (
  <div 
    className="torus-container"
    style={{
      position: 'absolute',
      left, top, right, bottom,
      width: size, height: size,
      zIndex: 0,
      pointerEvents: 'none',
      perspective: '1000px'
    }}
  >
    <div 
      className="torus-shape"
      style={{
        width: '100%',
        height: '100%',
        border: `${thickness}px solid ${color}`,
        borderRadius: '50%',
        animation: `${reverse ? 'rotate3d-reverse' : 'rotate3d'} ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
        opacity: 0.3,
        boxShadow: `inset 0 15px 30px rgba(0,0,0,0.05), 0 15px 30px rgba(0,0,0,0.05)`,
        background: gradient || 'transparent'
      }}
    />
  </div>
)

export default async function LandingPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('fb_session')?.value
  if (session) redirect('/dashboard')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', transition: 'background 0.3s ease' }}>
      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-overlay)', backdropFilter: 'var(--glass-blur)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: '72px', padding: '0 24px' }}>
          
          {/* Left: Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '24px', fontWeight: 800, fontFamily: 'Syne, sans-serif', letterSpacing: '-1px' }}>
            Torus<span style={{ color: 'var(--accent-teal)' }}>AI</span>
          </div>
          
          {/* Center: Nav Links */}
          <div className="nav-links-container" style={{ alignItems: 'center', gap: '32px', justifyContent: 'center' }}>
            <Link href="/" className="nav-link" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s', fontFamily: 'DM Sans, sans-serif' }}>Home</Link>
            <Link href="#features" className="nav-link" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s', fontFamily: 'DM Sans, sans-serif' }}>Features</Link>
            <Link href="#about" className="nav-link" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s', fontFamily: 'DM Sans, sans-serif' }}>About</Link>
            <Link href="/tools" className="nav-link" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s', fontFamily: 'DM Sans, sans-serif' }}>Tool Hub</Link>
          </div>

          {/* Right: Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'flex-end' }}>
            <ThemeToggle />
            <Link
              href="/login"
              className="login-link"
              style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s', fontFamily: 'Syne, sans-serif' }}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              style={{
                display: 'inline-flex', alignItems: 'center', height: '40px', padding: '0 20px',
                background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan) 58%, var(--accent-orange))', borderRadius: '10px',
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
        <div style={{ position: 'absolute', top: '-150px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, var(--focus) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
        
        {/* Floating Torus Backgrounds */}
        <TorusShape size={300} thickness={40} color="var(--border-subtle)" left="-100px" top="50px" delay={0} duration={20} gradient="radial-gradient(circle, var(--accent-teal-transparent) 0%, transparent 70%)" />
        <TorusShape size={450} thickness={60} color="var(--border-subtle)" right="-150px" top="-50px" delay={-5} duration={35} reverse={true} gradient="radial-gradient(circle, var(--accent-orange-transparent) 0%, transparent 70%)" />
        <TorusShape size={200} thickness={25} color="var(--focus)" left="20%" bottom="-50px" delay={-12} duration={25} gradient="radial-gradient(circle, var(--accent-cyan-transparent) 0%, transparent 70%)" />
        <TorusShape size={120} thickness={16} color="var(--border-subtle)" right="25%" top="180px" delay={-2} duration={15} />
        <TorusShape size={350} thickness={45} color="var(--border-subtle)" left="10%" top="600px" delay={-8} duration={30} reverse={true} gradient="radial-gradient(circle, var(--accent-teal-transparent) 0%, transparent 70%)" />
        <TorusShape size={280} thickness={35} color="var(--border-subtle)" right="15%" bottom="100px" delay={-15} duration={22} gradient="radial-gradient(circle, var(--accent-orange-transparent) 0%, transparent 70%)" />

        <style>{`
          @keyframes rotate3d {
            0% { transform: rotateX(45deg) rotateY(0deg) rotateZ(0deg); }
            100% { transform: rotateX(45deg) rotateY(360deg) rotateZ(360deg); }
          }
          @keyframes rotate3d-reverse {
            0% { transform: rotateX(-45deg) rotateY(360deg) rotateZ(360deg); }
            100% { transform: rotateX(-45deg) rotateY(0deg) rotateZ(0deg); }
          }
          .nav-link:hover { color: var(--accent-teal) !important; }
          .login-link:hover { color: var(--text-heading) !important; }
        `}</style>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '120px 24px 100px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'var(--surface-glass)', border: '1px solid var(--border-subtle)', borderRadius: '20px', fontSize: '12px', fontFamily: 'DM Mono, monospace', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '28px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <Sparkles size={14} color="var(--accent-teal)" />
            The Ultimate Developer Workspace
          </div>
          
          <h1 style={{ fontSize: '64px', fontWeight: 800, fontFamily: 'Syne, sans-serif', lineHeight: 1.1, letterSpacing: '-1.5px', margin: '0 0 24px', color: 'var(--text-heading)' }}>
            Architect your next app <br />
            <span style={{ color: 'var(--accent-teal)' }}>
              in minutes, not days.
            </span>
          </h1>
          
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            Convert raw ideas into structured blueprints, generate AI prompts, follow step-by-step architecture guides, and deploy seamlessly.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <Link
              href="/signup"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px', height: '56px', padding: '0 36px',
                background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan) 58%, var(--accent-orange))', color: '#fff', borderRadius: '14px', fontSize: '16px', fontWeight: 800,
                fontFamily: 'Syne, sans-serif', textDecoration: 'none', transition: 'transform 0.2s', boxShadow: '0 8px 24px rgba(66,127,131,0.25)'
              }}
            >
              Start Building <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              style={{
                display: 'inline-flex', alignItems: 'center', height: '56px', padding: '0 36px',
                background: 'var(--surface-glass)', color: 'var(--text-heading)', border: '1px solid var(--border-subtle)',
                borderRadius: '14px', fontSize: '16px', fontWeight: 700, fontFamily: 'Syne, sans-serif', textDecoration: 'none'
              }}
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              { icon: BrainCircuit, title: 'Idea Analyzer', desc: 'Type what you want to build. Torus AI instantly generates a complete tech stack and workflow.' },
              { icon: Code2, title: 'Step-by-Step Architecture', desc: 'Get a distraction-free, actionable guide for every phase of your project, with exact AI prompts.' },
              { icon: Wrench, title: 'Error Fix Assistant', desc: 'Hit a bug? Paste your terminal output and our AI Bot will explain the error and provide the fix.' },
              { icon: Rocket, title: 'Deploy with Confidence', desc: 'Project-aware deployment guides that recommend the best platform and give you the CLI commands.' },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} style={{ padding: '36px', background: 'var(--surface-glass)', border: '1px solid var(--border-subtle)', borderRadius: '24px', boxShadow: 'var(--card-shadow)', backdropFilter: 'var(--glass-blur)' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--focus)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--accent-teal)', border: '1px solid var(--border-subtle)' }}>
                    <Icon size={26} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'Syne, sans-serif', margin: '0 0 12px', color: 'var(--text-heading)' }}>{feature.title}</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tool Hub Section */}
        <div id="tools" style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, var(--accent-cyan-transparent) 0%, transparent 70%)', pointerEvents: 'none' }} />
          
          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)', borderRadius: '20px', fontSize: '12px', fontFamily: 'DM Mono, monospace', fontWeight: 600, color: 'var(--accent-teal)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <Wrench size={14} /> Comprehensive Tool Hub
              </div>
              <h2 style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: 'var(--text-heading)', margin: '0 0 20px', letterSpacing: '-1px' }}>Every AI tool you need, <br />in one workspace.</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>Browse 30+ top-tier AI tools categorized for LLMs, Design, Coding, and more. All ranked by Torus Score.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '60px' }}>
              {[
                { name: 'ChatGPT', cat: 'LLMs', emoji: '🧠', score: 9.8, url: 'https://chat.openai.com' },
                { name: 'Midjourney', cat: 'Image Gen', emoji: '🎨', score: 9.7, url: 'https://midjourney.com' },
                { name: 'Cursor', cat: 'Coding', emoji: '⚡', score: 9.9, url: 'https://cursor.com' },
                { name: 'Suno AI', cat: 'Audio', emoji: '🎵', score: 9.8, url: 'https://suno.com' },
                { name: 'v0.dev', cat: 'UI/UX', emoji: '🔮', score: 9.6, url: 'https://v0.dev' },
                { name: 'Groq', cat: 'Dev Tools', emoji: '🏎️', score: 9.8, url: 'https://groq.com' },
              ].map((tool, i) => (
                <a key={i} href={tool.url} target="_blank" rel="noopener noreferrer" className="tool-card" style={{ 
                  padding: '32px', 
                  background: 'var(--surface-overlay)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '20px', 
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                  cursor: 'pointer', 
                  textDecoration: 'none',
                  boxShadow: 'var(--card-shadow)'
                }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', border: '1px solid var(--border-subtle)' }}>{tool.emoji}</div>
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--text-heading)', fontSize: '18px', marginBottom: '4px' }}>{tool.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>{tool.cat} · <span style={{ color: 'var(--accent-teal)', fontWeight: 700 }}>{tool.score} Score</span></div>
                  </div>
                </a>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link href="/tools" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 36px', background: 'var(--text-heading)', border: '1px solid var(--text-heading)', borderRadius: '16px', color: 'var(--bg)', fontWeight: 800, fontSize: '16px', fontFamily: 'Syne, sans-serif', textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                Explore All AI Tools <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* About / Team Section */}
        <div id="about" style={{ padding: '140px 24px', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '600px', height: '600px', background: 'radial-gradient(circle, var(--accent-teal-transparent) 0%, transparent 70%)', pointerEvents: 'none' }} />
          
          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '100px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--surface-glass)', border: '1px solid var(--border-subtle)', borderRadius: '200px', fontSize: '12px', fontFamily: 'DM Mono, monospace', fontWeight: 600, color: 'var(--error)', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <Users size={14} /> The Visionaries
              </div>
              <h2 style={{ fontSize: '56px', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: 'var(--text-heading)', margin: '0 0 24px', letterSpacing: '-2px' }}>Built by Developers.</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '20px', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>Meet the architects and engineers who built the Torus AI ecosystem to empower the next generation of builders.</p>
              
              <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)', borderRadius: '16px', fontSize: '14px', fontWeight: 600, color: 'var(--text-heading)' }}>
                  <Upload size={18} color="var(--accent-teal)" /> Seamless Project Upload
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)', borderRadius: '16px', fontSize: '14px', fontWeight: 600, color: 'var(--text-heading)' }}>
                  <Zap size={18} color="var(--accent-orange)" /> Instant AI Roadmap
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px' }}>
              {[
                { name: 'APPARI MOHAN VENKATA NIKHIL', role: 'Team Leader', branch: 'AIML', roll: '24B11AI016', short: 'NIKHIL', college: 'AUS', email: '24b11ai016@adityauniversity.in', phone: '9849117467', leader: true },
                { name: 'BELLAMKONDA VENKATA SRUJITH', role: 'Member', branch: 'AIML', roll: '24B11AI033', short: 'SRUJITH', college: 'AUS', email: '24b11ai033@adityauniversity.in', phone: '8331893625' },
                { name: 'KOLAPARTHI RAVITEJA', role: 'Member', branch: 'AIML', roll: '24B11AI187', short: 'RAVI', college: 'AUS', email: '24b11ai187@adityauniversity.in', phone: '9491359776' },
                { name: 'PADALA SATYANARAYANA REDDY', role: 'Member', branch: 'AIML', roll: '24B11AI311', short: 'SATYA', college: 'AUS', email: '24b11ai311@adityauniversity.in', phone: '9133560677' },
                { name: 'YALAMANCHILI AKHIL', role: 'Member', branch: 'AIML', roll: '24B11AI461', short: 'AKHIL', college: 'AUS', email: '24b11ai461@adityauniversity.in', phone: '9490437137' },
                { name: 'YALLA SAI NAIDU', role: 'Member', branch: 'AIML', roll: '24B11AI464', short: 'SAI', college: 'AUS', email: '24b11ai464@adityauniversity.in', phone: '7032293645' },
              ].map((dev, i) => (
                <div key={i} className="dev-card" style={{ 
                  padding: '40px', 
                  background: 'var(--surface-overlay)', 
                  border: `1px solid ${dev.leader ? 'rgba(239,68,68,0.4)' : 'var(--border-subtle)'}`, 
                  borderRadius: '24px', 
                  boxShadow: 'var(--card-shadow)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'default'
                }}>
                  {/* Decorative glow */}
                  <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: dev.leader ? 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)' : 'transparent', pointerEvents: 'none' }} />

                  {dev.leader && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                      <span style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.15)', color: '#10b981', fontSize: '10px', fontWeight: 900, borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', border: '1px solid rgba(16,185,129,0.2)' }}>YOU</span>
                      <span style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontSize: '10px', fontWeight: 900, borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', border: '1px solid rgba(239,68,68,0.2)' }}>TEAM LEADER</span>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--bg-3), var(--surface))', border: '2px solid var(--border-subtle)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                        👤
                      </div>
                      <div style={{ position: 'absolute', bottom: '4px', right: '4px', width: '14px', height: '14px', background: '#10b981', border: '3px solid var(--surface-overlay)', borderRadius: '50%' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-heading)', margin: '0 0 6px', lineHeight: 1.1, fontFamily: 'Syne, sans-serif' }}>{dev.name}</h3>
                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>{dev.role}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px', borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'DM Mono, monospace', letterSpacing: '0.5px' }}>Branch</label>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)' }}>{dev.branch}</div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'DM Mono, monospace', letterSpacing: '0.5px' }}>Roll No</label>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)' }}>{dev.roll}</div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'DM Mono, monospace', letterSpacing: '0.5px' }}>Short Name</label>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)' }}>{dev.short}</div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'DM Mono, monospace', letterSpacing: '0.5px' }}>College</label>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)' }}>{dev.college}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '14px', padding: '10px 16px', background: 'var(--bg-2)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                      <Mail size={16} style={{ color: '#ef4444' }} /> {dev.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '14px', padding: '10px 16px', background: 'var(--bg-2)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                      <Phone size={16} style={{ color: '#ef4444' }} /> {dev.phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <style>{`
            .dev-card:hover { 
              transform: translateY(-8px); 
              border-color: #ef4444 !important;
              box-shadow: 0 20px 40px rgba(239,68,68,0.08);
            }
            .tool-card:hover {
              border-color: var(--accent-teal) !important;
              transform: translateY(-2px);
            }
          `}</style>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '40px 24px', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '13px', fontFamily: 'DM Mono, monospace' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px', fontSize: '16px', fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'var(--text-heading)' }}>
          Torus<span style={{ color: 'var(--accent-teal)' }}>AI</span>
        </div>
        © {new Date().getFullYear()} Torus AI Workspace. All rights reserved.
      </footer>
      <style>{`
        .nav-link:hover, .login-link:hover { color: var(--text-heading) !important; }
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
