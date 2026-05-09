// lib/searxng.ts

interface SearchResult {
  title: string
  url: string
  content: string
}

export async function search(query: string, count = 5): Promise<SearchResult[]> {
  const baseUrl = process.env.SEARXNG_BASE_URL || 'http://localhost:8080'
  
  try {
    const url = `${baseUrl}/search?q=${encodeURIComponent(query)}&format=json&categories=general&language=en`
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }, // cache 1 hour
      signal: AbortSignal.timeout(4000)
    })
    
    if (!res.ok) throw new Error(`SearXNG error: ${res.status}`)
    
    const data = await res.json()
    return (data.results || []).slice(0, count).map((r: any) => ({
      title: r.title || '',
      url: r.url || '',
      content: r.content || r.snippet || ''
    }))
  } catch (err) {
    console.warn('SearXNG unavailable, using fallback:', err)
    return getFallbackResults(query)
  }
}

// Fallback when SearXNG is not available (development / demo)
function getFallbackResults(query: string): SearchResult[] {
  const fallbacks: Record<string, SearchResult[]> = {
    'frontend': [
      { title: 'Next.js - The React Framework', url: 'https://nextjs.org', content: 'Next.js is the leading React framework with built-in routing, SSR, and Vercel deployment. Best choice for web apps in 2025.' },
      { title: 'React - A JavaScript Library', url: 'https://react.dev', content: 'React is the most popular UI library. Use with Vite for SPAs.' },
    ],
    'backend': [
      { title: 'Next.js API Routes', url: 'https://nextjs.org/docs/api-routes', content: 'Next.js API routes allow you to build your API directly in your Next.js app. Deploy to Vercel for free.' },
      { title: 'Railway - Deploy Node.js', url: 'https://railway.app', content: 'Railway makes it easy to deploy Node.js, Python, Go backends with free $5/mo credit.' },
    ],
    'database': [
      { title: 'Supabase - Open Source Firebase', url: 'https://supabase.com', content: 'Supabase provides PostgreSQL database, Auth, Realtime, and Storage. Free tier: 500MB, 50k users.' },
      { title: 'Neon - Serverless Postgres', url: 'https://neon.tech', content: 'Neon offers serverless PostgreSQL with branching. Free tier available.' },
    ],
    'auth': [
      { title: 'Supabase Auth', url: 'https://supabase.com/auth', content: 'Supabase Auth supports email/password, OAuth (Google, GitHub), and magic links. Free with Supabase.' },
      { title: 'Clerk - Authentication', url: 'https://clerk.com', content: 'Clerk provides complete user management. Free tier: 10,000 MAU.' },
    ],
    'ai': [
      { title: 'Groq - Fast AI Inference', url: 'https://groq.com', content: 'Groq provides the fastest LLM inference available. Free tier: 14,400 requests/day with Llama 3.3 70B.' },
      { title: 'Google Gemini API', url: 'https://ai.google.dev', content: 'Gemini Flash is free with generous limits. Good fallback option.' },
    ],
    'deployment': [
      { title: 'Vercel - Frontend Deployment', url: 'https://vercel.com', content: 'Vercel offers zero-config Next.js deployment with free tier, global CDN, and unlimited bandwidth.' },
      { title: 'Railway', url: 'https://railway.app', content: 'Railway deploys backends with Docker support. Free $5/mo credit.' },
    ],
  }

  const queryLower = query.toLowerCase()
  for (const [key, results] of Object.entries(fallbacks)) {
    if (queryLower.includes(key)) return results
  }
  
  return [
    { title: 'Supabase', url: 'https://supabase.com', content: 'Full-stack solution: DB + Auth + Storage. Free tier.' },
    { title: 'Vercel', url: 'https://vercel.com', content: 'Best hosting for Next.js apps. Free tier.' },
  ]
}

export async function searchMultiple(queries: string[]): Promise<Record<string, SearchResult[]>> {
  const results = await Promise.all(queries.map(q => search(q)))
  return Object.fromEntries(queries.map((q, i) => [q, results[i]]))
}

export function formatSearchResults(results: SearchResult[]): string {
  return results.map(r => `• ${r.title}: ${r.content}`).join('\n')
}
