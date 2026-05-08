// app/page.tsx  — Landing page (server component)
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { session } } = await supabase.auth.getSession()
  if (session) redirect('/dashboard')

  return (
    <div style={{ minHeight: '100vh', background: '#eef3f4', color: '#172326', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', background: 'rgba(246,249,249,.72)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(38,69,72,.08)' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '19px', letterSpacing: '-0.5px' }}>
          Torus<span style={{ color: '#5aa0a4' }}>AI</span>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[['#features', 'Features'], ['#how', 'How it works'], ['#pricing', 'Pricing'], ['/tools', 'Tool Hub']].map(([href, label]) => (
            <Link key={href} href={href} style={{ color: '#607276', textDecoration: 'none', fontSize: '13px', transition: 'color .15s' }}
              >{label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/login" style={{ padding: '6px 16px', border: '1px solid rgba(38,69,72,.12)', borderRadius: '8px', color: '#607276', textDecoration: 'none', fontSize: '13px' }}>
            Login
          </Link>
          <Link href="/signup" style={{ padding: '7px 18px', background: 'linear-gradient(135deg, #365f62, #83b9bd)', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '13px', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '100px 40px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(circle, rgba(124,58,237,.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-block', padding: '5px 14px', background: 'rgba(66,127,131,.15)', border: '1px solid rgba(66,127,131,.3)', borderRadius: '20px', fontSize: '12px', color: '#83b9bd', fontFamily: 'DM Mono, monospace', marginBottom: '24px' }}>
          ✨ Powered by Groq + SearXNG — Free forever
        </div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(40px,6vw,72px)', fontWeight: 800, letterSpacing: '-2px', lineHeight: '1.05', marginBottom: '20px', maxWidth: '800px', margin: '0 auto 20px' }}>
          Build anything.<br />
          <span style={{ color: '#5aa0a4' }}>Ship everything.</span>
        </h1>
        <p style={{ color: '#607276', fontSize: '17px', lineHeight: '1.7', maxWidth: '520px', margin: '0 auto 36px' }}>
          Describe your project. Get the perfect tech stack, a visual architecture, and exact prompts for every build phase — powered by live web search + Groq AI.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup" style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #365f62, #83b9bd)', borderRadius: '12px', color: '#fff', textDecoration: 'none', fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 800, boxShadow: '0 8px 32px rgba(66,127,131,.28)', transition: 'all .2s' }}>
            Start Building Free →
          </Link>
          <Link href="/login" style={{ padding: '14px 28px', background: 'transparent', border: '1px solid rgba(38,69,72,.14)', borderRadius: '12px', color: '#607276', textDecoration: 'none', fontSize: '15px' }}>
            Sign in
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '28px', justifyContent: 'center', marginTop: '28px', fontSize: '12px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace' }}>
          <span>✓ 100% Free</span><span>✓ No credit card</span><span>✓ Open source</span><span>✓ $0/month</span>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '80px 40px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#5aa0a4', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>How It Works</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '36px', fontWeight: 800, letterSpacing: '-1px' }}>From idea to deployed in 4 steps</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { n: '01', emoji: '💬', title: 'Describe', body: 'Tell Torus AI your idea. Platform, budget, features — as much or as little as you like.' },
            { n: '02', emoji: '🔍', title: 'Search', body: 'Torus AI searches the web for the best current tools for your specific stack.' },
            { n: '03', emoji: '🏗️', title: 'Architecture', body: 'Get a visual architecture diagram with every component explained and connected.' },
            { n: '04', emoji: '⚡', title: 'Prompts', body: 'Copy-paste prompts for each phase. Optimised for Cursor, Windsurf, Bolt.new, and more.' },
          ].map(step => (
            <div key={step.n} style={{ background: 'rgba(255,255,255,.62)', border: '1px solid rgba(38,69,72,.12)', borderRadius: '14px', padding: '22px', textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(66,127,131,.2)', border: '1px solid rgba(66,127,131,.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontFamily: 'DM Mono, monospace', color: '#5aa0a4', margin: '0 auto 14px' }}>{step.n}</div>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>{step.emoji}</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{step.title}</h3>
              <p style={{ color: '#607276', fontSize: '12px', lineHeight: '1.6' }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '60px 40px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>Everything you need to ship</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { e: '✨', t: 'AI Build Planner', b: 'Describe your idea. Get a full plan — stack, phases, prompts — in under 30 seconds.' },
            { e: '🔍', t: 'Live Tool Search', b: 'SearXNG searches the web at plan-time so your stack recommendations are always current.' },
            { e: '🏗️', t: 'Architecture Builder', b: 'Visual drag-and-drop canvas. Add nodes, connect services, export as PNG or PDF.' },
            { e: '⚡', t: 'Phase Prompts', b: 'Exact prompts for each of 7 build phases. Switch between Cursor, Windsurf, Bolt.new.' },
            { e: '🔧', t: 'Error Fix', b: 'Paste any error. Get an explanation, debug steps, and a fixed prompt instantly.' },
            { e: '📦', t: 'Project Blueprint', b: 'Auto-generated file structure, API routes, DB schema, and .env template.' },
            { e: '🚀', t: 'Deploy Guide', b: 'Step-by-step deployment to Vercel, Railway, Render, or Cloudflare — all free.' },
            { e: '🏆', t: 'Achievement Badges', b: 'GitHub-style badges. Earn them by building, shipping, and maintaining streaks.' },
            { e: '🆓', t: '$0/month Forever', b: 'Supabase + Groq + SearXNG + Vercel. Total cost: zero. No catch.' },
          ].map(f => (
            <div key={f.t} style={{ background: 'rgba(255,255,255,.62)', border: '1px solid rgba(38,69,72,.12)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>{f.e}</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 700, marginBottom: '7px' }}>{f.t}</h3>
              <p style={{ color: '#607276', fontSize: '12px', lineHeight: '1.6' }}>{f.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '60px 40px', maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>Simple pricing</h2>
        <p style={{ color: '#607276', marginBottom: '36px' }}>One plan. Everything included. Always free.</p>
        <div style={{ background: 'rgba(255,255,255,.62)', border: '1px solid rgba(66,127,131,.3)', borderRadius: '20px', padding: '36px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '52px', fontWeight: 800, color: '#5aa0a4', marginBottom: '4px' }}>$0</div>
          <div style={{ color: '#607276', marginBottom: '28px' }}>forever</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '28px', textAlign: 'left' }}>
            {['Unlimited projects', 'AI build plans', 'Phase-by-phase prompts', 'Architecture builder',
              'Error fix assistant', 'Tool hub (18+ tools)', 'Achievement badges', 'Deploy guide',
              'Groq AI (14,400 req/day)', 'Supabase database', 'Open source'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#607276' }}>
                  <span style={{ color: '#10b981' }}>✓</span> {f}
                </div>
              ))}
          </div>
          <Link href="/signup" style={{ display: 'block', padding: '13px', background: 'linear-gradient(135deg, #365f62, #83b9bd)', borderRadius: '12px', color: '#fff', textDecoration: 'none', fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 800 }}>
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '80px 40px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '14px' }}>Ready to start building?</h2>
        <p style={{ color: '#607276', marginBottom: '28px' }}>Join developers using Torus AI to plan and ship faster.</p>
        <Link href="/signup" style={{ padding: '14px 40px', background: 'linear-gradient(135deg, #365f62, #83b9bd)', borderRadius: '12px', color: '#fff', textDecoration: 'none', fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 800, boxShadow: '0 8px 32px rgba(66,127,131,.28)' }}>
          Start Building Free →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(38,69,72,.08)', padding: '28px 40px', textAlign: 'center', color: '#8a9a9d', fontSize: '13px' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '16px', marginBottom: '6px', color: '#607276' }}>Torus<span style={{ color: '#5aa0a4' }}>AI</span></div>
        Build anything. Ship everything. · torusai.io · Open source · © 2025
      </footer>
    </div>
  )
}
