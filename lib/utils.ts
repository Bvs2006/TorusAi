// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + '...' : str
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export const BADGE_DEFINITIONS = [
  { id: 'first_ship', name: 'First Ship', emoji: '🚀', rarity: 'common', condition: 'Deploy your first project' },
  { id: 'full_stack', name: 'Full Stack', emoji: '🧱', rarity: 'rare', condition: 'Complete all 7 build phases' },
  { id: 'prompt_wizard', name: 'Prompt Wizard', emoji: '🔮', rarity: 'rare', condition: 'Generate 50+ prompts' },
  { id: 'week_warrior', name: 'Week Warrior', emoji: '🔥', rarity: 'epic', condition: '7-day build streak' },
  { id: 'serial_builder', name: 'Serial Builder', emoji: '🏗️', rarity: 'rare', condition: 'Complete 3 projects' },
  { id: 'legend', name: 'Legend x10', emoji: '👑', rarity: 'legendary', condition: 'Ship 10 projects' },
] as const

export const TOOLS_DB = [
  { name: 'Cursor', emoji: '⚡', score: 9.4, description: 'AI-first code editor with deep codebase context.', category: 'AI Coding', pricing: 'Freemium', tags: ['AI Coding', 'Editor'], url: 'https://cursor.sh' },
  { name: 'Windsurf', emoji: '🌊', score: 9.1, description: 'Codeium\'s AI IDE with Cascade agent.', category: 'AI Coding', pricing: 'Free', tags: ['AI Coding', 'Editor'], url: 'https://codeium.com/windsurf' },
  { name: 'Supabase', emoji: '🔵', score: 9.0, description: 'Open-source Firebase alternative — DB + Auth + Realtime + Storage.', category: 'Database', pricing: 'Free', tags: ['Database', 'Auth', 'Realtime'], url: 'https://supabase.com' },
  { name: 'Vercel', emoji: '▲', score: 8.9, description: 'Zero-config Next.js deployment with auto-CDN.', category: 'Deployment', pricing: 'Free', tags: ['Deployment', 'Frontend'], url: 'https://vercel.com' },
  { name: 'Groq', emoji: '🤖', score: 8.8, description: 'Fastest LLM inference — 14,400 free req/day.', category: 'AI Service', pricing: 'Free', tags: ['AI', 'LLM'], url: 'https://groq.com' },
  { name: 'Railway', emoji: '🚀', score: 8.7, description: 'Deploy backends instantly with Docker support.', category: 'Deployment', pricing: 'Freemium', tags: ['Deployment', 'Backend'], url: 'https://railway.app' },
  { name: 'v0 by Vercel', emoji: '🔮', score: 8.6, description: 'Generate production-ready UI from text prompts.', category: 'Design', pricing: 'Freemium', tags: ['Design', 'UI', 'AI'], url: 'https://v0.dev' },
  { name: 'n8n', emoji: '🔄', score: 8.5, description: 'Open-source workflow automation. Self-hostable.', category: 'Automation', pricing: 'Free', tags: ['Automation', 'Integration'], url: 'https://n8n.io' },
  { name: 'Bolt.new', emoji: '⚡', score: 8.4, description: 'Full-stack web apps from a single prompt.', category: 'AI Coding', pricing: 'Freemium', tags: ['AI Coding', 'Full-stack'], url: 'https://bolt.new' },
  { name: 'Neon', emoji: '🐘', score: 8.3, description: 'Serverless PostgreSQL — branch your DB like Git.', category: 'Database', pricing: 'Free', tags: ['Database', 'Postgres'], url: 'https://neon.tech' },
  { name: 'Resend', emoji: '✉️', score: 8.2, description: 'Developer-first email API — 3,000 emails/month free.', category: 'Backend', pricing: 'Free', tags: ['Email', 'Backend'], url: 'https://resend.com' },
  { name: 'Clerk', emoji: '🔑', score: 8.1, description: 'Drop-in authentication — beautiful UI included.', category: 'Backend', pricing: 'Freemium', tags: ['Auth', 'Backend'], url: 'https://clerk.com' },
  { name: 'Lovable', emoji: '💜', score: 8.0, description: 'AI that builds full-stack apps from natural language.', category: 'AI Coding', pricing: 'Freemium', tags: ['AI Coding', 'No-code'], url: 'https://lovable.dev' },
  { name: 'PlanetScale', emoji: '🌍', score: 7.9, description: 'MySQL-compatible serverless DB with branching.', category: 'Database', pricing: 'Freemium', tags: ['Database', 'MySQL'], url: 'https://planetscale.com' },
  { name: 'Render', emoji: '🎯', score: 7.8, description: 'Cloud hosting for web services and DBs.', category: 'Deployment', pricing: 'Free', tags: ['Deployment', 'Backend'], url: 'https://render.com' },
  { name: 'Convex', emoji: '🔺', score: 7.7, description: 'Real-time backend-as-a-service with TypeScript queries.', category: 'Backend', pricing: 'Free', tags: ['Backend', 'Realtime'], url: 'https://convex.dev' },
  { name: 'Figma', emoji: '🎨', score: 7.6, description: 'The standard for UI/UX design with Dev Mode.', category: 'Design', pricing: 'Freemium', tags: ['Design', 'Collaboration'], url: 'https://figma.com' },
  { name: 'ElevenLabs', emoji: '🎙️', score: 7.5, description: 'AI voice generation and cloning.', category: 'AI Service', pricing: 'Free', tags: ['AI', 'Voice'], url: 'https://elevenlabs.io' },
]
