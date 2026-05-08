export type ToolCategory = 'frontend' | 'backend' | 'database' | 'auth' | 'ai' | 'deployment' | 'storage' | 'cdn';

export interface TechTool {
  id: string;
  name: string;
  category: ToolCategory;
  emoji: string;
  color: string;
  bg: string;
  aiRecommended?: string;
  whyThisTool?: string;
  alternative?: string;
  costPerMonth?: string;
  performanceScore?: number; // 0-5
  deployTarget?: string;
}

export const CATEGORIES: { id: ToolCategory; label: string; emoji: string }[] = [
  { id: 'frontend', label: 'Frontend', emoji: '🖥️' },
  { id: 'backend', label: 'Backend', emoji: '⚙️' },
  { id: 'database', label: 'Database', emoji: '🗄️' },
  { id: 'auth', label: 'Auth', emoji: '🔑' },
  { id: 'ai', label: 'AI Service', emoji: '🤖' },
  { id: 'storage', label: 'Storage', emoji: '📦' },
  { id: 'cdn', label: 'CDN', emoji: '🌐' },
  { id: 'deployment', label: 'Deploy', emoji: '🚀' },
];

export const TECH_TOOLS: TechTool[] = [
  // Frontend
  { id: 'nextjs', name: 'Next.js', category: 'frontend', emoji: 'N', color: '#ffffff', bg: 'rgba(255,255,255,0.07)', aiRecommended: 'Next.js 14 App Router', whyThisTool: 'Best SSR + SEO + API routes in one.', alternative: 'Remix', costPerMonth: '$0', performanceScore: 5 },
  { id: 'react', name: 'React', category: 'frontend', emoji: '⚛️', color: '#61dafb', bg: 'rgba(97,218,251,0.1)', aiRecommended: 'React 18 + Vite', whyThisTool: 'Largest ecosystem, hooks-based, fast SPA.', alternative: 'Preact', costPerMonth: '$0', performanceScore: 4 },
  { id: 'vue', name: 'Vue.js', category: 'frontend', emoji: 'V', color: '#4fc08d', bg: 'rgba(79,192,141,0.1)', aiRecommended: 'Nuxt 3', whyThisTool: 'Progressive framework, easy learning curve.', alternative: 'Angular', costPerMonth: '$0', performanceScore: 4 },
  { id: 'svelte', name: 'Svelte', category: 'frontend', emoji: 'S', color: '#ff3e00', bg: 'rgba(255,62,0,0.1)', aiRecommended: 'SvelteKit', whyThisTool: 'No virtual DOM, fastest client-side runtime.', alternative: 'Solid.js', costPerMonth: '$0', performanceScore: 5 },
  { id: 'reactnative', name: 'React Native', category: 'frontend', emoji: '📱', color: '#61dafb', bg: 'rgba(97,218,251,0.1)', aiRecommended: 'React Native + Expo', whyThisTool: 'Cross-platform iOS + Android from one codebase.', alternative: 'Flutter', costPerMonth: '$0', performanceScore: 4 },
  { id: 'flutter', name: 'Flutter', category: 'frontend', emoji: '🐦', color: '#02569B', bg: 'rgba(2,86,155,0.1)', aiRecommended: 'Flutter 3 (Dart)', whyThisTool: 'Pixel-perfect UI, native performance.', alternative: 'React Native', costPerMonth: '$0', performanceScore: 5 },

  // Backend
  { id: 'node', name: 'Node.js', category: 'backend', emoji: '🟢', color: '#339933', bg: 'rgba(51,153,51,0.1)', aiRecommended: 'Node.js + Express', whyThisTool: 'Massive npm ecosystem, event-driven I/O.', alternative: 'Bun', costPerMonth: '$5-20', performanceScore: 4 },
  { id: 'python', name: 'Python (FastAPI)', category: 'backend', emoji: '🐍', color: '#3776AB', bg: 'rgba(55,118,171,0.1)', aiRecommended: 'FastAPI + Pydantic', whyThisTool: 'Best for ML/AI APIs, async-first, auto docs.', alternative: 'Django REST', costPerMonth: '$5-20', performanceScore: 4 },
  { id: 'go', name: 'Go', category: 'backend', emoji: '🐹', color: '#00ADD8', bg: 'rgba(0,173,216,0.1)', aiRecommended: 'Go + Gin', whyThisTool: 'Compiled, extreme throughput, low memory.', alternative: 'Rust (Axum)', costPerMonth: '$5-20', performanceScore: 5 },
  { id: 'nextapi', name: 'Next.js API', category: 'backend', emoji: 'N', color: '#aaaaaa', bg: 'rgba(255,255,255,0.07)', aiRecommended: 'Next.js Route Handlers', whyThisTool: 'Collocated API with your frontend, no separate server.', alternative: 'Hono', costPerMonth: '$0', performanceScore: 4 },

  // Database
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', emoji: '🐘', color: '#336791', bg: 'rgba(51,103,145,0.1)', aiRecommended: 'Supabase Postgres', whyThisTool: 'Best free tier (500MB) + Realtime built in.', alternative: 'Neon + Drizzle', costPerMonth: '$0', performanceScore: 5 },
  { id: 'mongodb', name: 'MongoDB', category: 'database', emoji: '🍃', color: '#47A248', bg: 'rgba(71,162,72,0.1)', aiRecommended: 'MongoDB Atlas M0', whyThisTool: 'Flexible JSON schema, great for rapid iteration.', alternative: 'PlanetScale', costPerMonth: '$0', performanceScore: 4 },
  { id: 'supabase-db', name: 'Supabase DB', category: 'database', emoji: '⚡', color: '#3ECF8E', bg: 'rgba(62,207,142,0.1)', aiRecommended: 'Supabase Postgres', whyThisTool: 'Best free tier (500MB) + Realtime built in.', alternative: 'Neon + Drizzle', costPerMonth: '$0', performanceScore: 5 },
  { id: 'firebase-db', name: 'Firestore', category: 'database', emoji: '🔥', color: '#FFCA28', bg: 'rgba(255,202,40,0.1)', aiRecommended: 'Firestore Native Mode', whyThisTool: 'Offline-first, real-time sync for mobile.', alternative: 'Supabase', costPerMonth: '$0', performanceScore: 4 },
  { id: 'redis', name: 'Redis', category: 'database', emoji: '🔴', color: '#DC382D', bg: 'rgba(220,56,45,0.1)', aiRecommended: 'Upstash Redis (Serverless)', whyThisTool: 'Sub-millisecond caching, rate limiting, queues.', alternative: 'Memcached', costPerMonth: '$0', performanceScore: 5 },

  // Auth
  { id: 'supabase-auth', name: 'Supabase Auth', category: 'auth', emoji: '⚡', color: '#3ECF8E', bg: 'rgba(62,207,142,0.1)', aiRecommended: 'Supabase Auth + OAuth', whyThisTool: 'Free 50k MAU, built-in OAuth, Row Level Security.', alternative: 'Clerk', costPerMonth: '$0', performanceScore: 5 },
  { id: 'clerk', name: 'Clerk', category: 'auth', emoji: '🔐', color: '#6C47FF', bg: 'rgba(108,71,255,0.1)', aiRecommended: 'Clerk Dev Plan', whyThisTool: 'Drop-in auth UI, MFA, org management built-in.', alternative: 'Auth0', costPerMonth: '$0', performanceScore: 5 },
  { id: 'nextauth', name: 'NextAuth', category: 'auth', emoji: '🛡️', color: '#9d93c4', bg: 'rgba(157,147,196,0.1)', aiRecommended: 'NextAuth v5 (Auth.js)', whyThisTool: 'Open source, runs in Edge, all major providers.', alternative: 'Lucia', costPerMonth: '$0', performanceScore: 4 },
  { id: 'firebase-auth', name: 'Firebase Auth', category: 'auth', emoji: '🔥', color: '#FFCA28', bg: 'rgba(255,202,40,0.1)', aiRecommended: 'Firebase Authentication', whyThisTool: 'Free 10k/month auth, Google Sign-In, phone auth.', alternative: 'Supabase Auth', costPerMonth: '$0', performanceScore: 4 },

  // AI Service
  { id: 'groq', name: 'Groq', category: 'ai', emoji: '⚡', color: '#f55036', bg: 'rgba(245,80,54,0.1)', aiRecommended: 'Groq Llama 3.3 70B', whyThisTool: 'Fastest inference (500 tok/s), free tier 14,400 req/day.', alternative: 'OpenAI GPT-4o Mini', costPerMonth: '$0', performanceScore: 5 },
  { id: 'openai', name: 'OpenAI', category: 'ai', emoji: '🧠', color: '#412991', bg: 'rgba(65,41,145,0.1)', aiRecommended: 'GPT-4o', whyThisTool: 'Most capable model, vision + function calling.', alternative: 'Anthropic Claude', costPerMonth: '$20+', performanceScore: 5 },
  { id: 'anthropic', name: 'Anthropic', category: 'ai', emoji: 'A', color: '#d97757', bg: 'rgba(217,119,87,0.1)', aiRecommended: 'Claude 3.5 Sonnet', whyThisTool: 'Best for long context (200k), coding tasks.', alternative: 'GPT-4o', costPerMonth: '$20+', performanceScore: 5 },
  { id: 'gemini', name: 'Gemini', category: 'ai', emoji: '✨', color: '#4285F4', bg: 'rgba(66,133,244,0.1)', aiRecommended: 'Gemini 1.5 Flash', whyThisTool: 'Free 15 req/min, 1M context, multimodal.', alternative: 'Groq', costPerMonth: '$0', performanceScore: 4 },
  { id: 'replicate', name: 'Replicate', category: 'ai', emoji: 'R', color: '#9d93c4', bg: 'rgba(157,147,196,0.1)', aiRecommended: 'Replicate + Flux', whyThisTool: 'On-demand GPU for image/video/audio generation.', alternative: 'Fal.ai', costPerMonth: '$0 (pay-per-run)', performanceScore: 4 },

  // Storage
  { id: 's3', name: 'AWS S3', category: 'storage', emoji: '🪣', color: '#FF9900', bg: 'rgba(255,153,0,0.1)', aiRecommended: 'S3 Standard', whyThisTool: 'Industry standard, 5GB free, 11 9s durability.', alternative: 'Cloudflare R2', costPerMonth: '$0', performanceScore: 5 },
  { id: 'r2', name: 'Cloudflare R2', category: 'storage', emoji: '☁️', color: '#F38020', bg: 'rgba(243,128,32,0.1)', aiRecommended: 'R2 (S3-compatible)', whyThisTool: 'Zero egress fees, S3 API compatible, 10GB free.', alternative: 'AWS S3', costPerMonth: '$0', performanceScore: 5 },
  { id: 'supabase-storage', name: 'Supabase Storage', category: 'storage', emoji: '⚡', color: '#3ECF8E', bg: 'rgba(62,207,142,0.1)', aiRecommended: 'Supabase Storage', whyThisTool: 'Integrated with your Supabase DB + RLS support.', alternative: 'AWS S3', costPerMonth: '$0', performanceScore: 4 },

  // CDN
  { id: 'cloudflare-cdn', name: 'Cloudflare', category: 'cdn', emoji: '🌤️', color: '#F38020', bg: 'rgba(243,128,32,0.1)', aiRecommended: 'Cloudflare Free', whyThisTool: '330 PoPs globally, DDoS protection, free plan.', alternative: 'Fastly', costPerMonth: '$0', performanceScore: 5 },
  { id: 'vercel-edge', name: 'Vercel Edge', category: 'cdn', emoji: 'V', color: '#ffffff', bg: 'rgba(255,255,255,0.07)', aiRecommended: 'Vercel Edge Network', whyThisTool: 'Built into Vercel, auto-scales, global by default.', alternative: 'Cloudflare', costPerMonth: '$0', performanceScore: 5 },

  // Deployment
  { id: 'vercel', name: 'Vercel', category: 'deployment', emoji: 'V', color: '#ffffff', bg: 'rgba(255,255,255,0.07)', aiRecommended: 'Vercel Hobby', whyThisTool: 'Zero-config Next.js deployment, instant preview URLs.', alternative: 'Netlify', costPerMonth: '$0', performanceScore: 5 },
  { id: 'railway', name: 'Railway', category: 'deployment', emoji: '🚂', color: '#c8a0ff', bg: 'rgba(200,160,255,0.1)', aiRecommended: 'Railway Starter', whyThisTool: '$5 free credit/month, easy Dockerized deploys.', alternative: 'Render', costPerMonth: '$5', performanceScore: 4 },
  { id: 'render', name: 'Render', category: 'deployment', emoji: '☁️', color: '#46E3B7', bg: 'rgba(70,227,183,0.1)', aiRecommended: 'Render Free Tier', whyThisTool: 'Free web services, auto-deploy from Git.', alternative: 'Fly.io', costPerMonth: '$0', performanceScore: 4 },
  { id: 'aws', name: 'AWS', category: 'deployment', emoji: '🌩️', color: '#FF9900', bg: 'rgba(255,153,0,0.1)', aiRecommended: 'AWS EC2 / Lambda', whyThisTool: 'Industry gold standard, infinite scalability.', alternative: 'GCP', costPerMonth: '$5+', performanceScore: 5 },
  { id: 'cloudflare', name: 'Cloudflare Workers', category: 'deployment', emoji: '🌤️', color: '#F38020', bg: 'rgba(243,128,32,0.1)', aiRecommended: 'Workers Free', whyThisTool: '100k free req/day, edge compute, zero cold starts.', alternative: 'Vercel Edge', costPerMonth: '$0', performanceScore: 5 },
];
