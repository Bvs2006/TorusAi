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

export const CATEGORIES = [
  'All', '3D AI', 'AI APIs', 'AI Automation', 'AI Design', 'AI Marketing', 
  'AI Resources', 'AI SDKs', 'AI Tools', 'Agents', 'Assistant', 'Business'
]

export const TOOLS_DB = [
  { name: 'Cursor', domain: 'cursor.sh', emoji: '⚡', score: 9.4, views: 658, favorites: 124, description: 'AI-first code editor with deep codebase context.', category: 'AI Tools', pricing: 'Freemium', tags: ['AI', 'Coding'], url: 'https://cursor.sh', gradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)' },
  { name: 'Lovable', domain: 'lovable.dev', emoji: '💜', score: 9.1, views: 420, favorites: 89, description: 'Build apps and websites by chatting with AI.', category: 'Low-Code AI Building', pricing: 'Freemium', tags: ['AI', 'Coding'], url: 'https://lovable.dev', gradient: 'linear-gradient(135deg, #4c1d95, #ec4899)' },
  { name: 'Bolt.new', domain: 'bolt.new', emoji: '⚡', score: 8.8, views: 312, favorites: 56, description: 'Prompt, run, edit, and deploy web apps directly in the browser.', category: 'Low-Code AI Building', pricing: 'Freemium', tags: ['AI', 'Coding'], url: 'https://bolt.new', gradient: 'linear-gradient(135deg, #0f172a, #334155)' },
  { name: 'Consul', domain: 'consul.so', emoji: '🏢', score: 8.7, views: 28, favorites: 1, description: 'Consul is your AI executive assistant, managing your schedule, email, and tasks.', category: 'Assistant', pricing: 'Paid', tags: ['AI', 'Business'], url: 'https://consul.so', gradient: 'linear-gradient(135deg, #cbd5e1, #f8fafc)' },
  { name: 'Firecrawl', domain: 'firecrawl.dev', emoji: '🔥', score: 8.6, views: 224, favorites: 14, description: 'Turn websites into LLM-ready data. The web crawling, scraping, and search API for AI.', category: 'AI APIs', pricing: 'Freemium', tags: ['AI', 'AI APIs'], url: 'https://firecrawl.dev', gradient: 'linear-gradient(135deg, #ef4444, #f97316)' },
  { name: 'Chef by Convex', domain: 'chef.convex.dev', emoji: '👨‍🍳', score: 8.5, views: 140, favorites: 8, description: 'Cook up something hot with Chef, the full-stack AI coding agent from Convex.', category: 'Agents', pricing: 'Free', tags: ['AI', 'Coding'], url: 'https://chef.convex.dev', gradient: 'linear-gradient(135deg, #7f1d1d, #dc2626)' },
  { name: 'Smithery', domain: 'smithery.ai', emoji: '🔨', score: 8.4, views: 91, favorites: 5, description: 'Model Context Protocol Registry. Extend your agents capabilities with MCP.', category: 'AI SDKs', pricing: 'Free', tags: ['AI', 'MCP'], url: 'https://smithery.ai', gradient: 'linear-gradient(135deg, #1e293b, #0f172a)' },
  { name: 'v0 by Vercel', domain: 'v0.dev', emoji: '🔮', score: 8.9, views: 512, favorites: 98, description: 'Generate production-ready UI from text prompts.', category: 'AI Design', pricing: 'Freemium', tags: ['AI', 'Design'], url: 'https://v0.dev', gradient: 'linear-gradient(135deg, #000000, #333333)' },
  { name: 'n8n', domain: 'n8n.io', emoji: '🔄', score: 8.3, views: 189, favorites: 22, description: 'Open-source workflow automation. Self-hostable.', category: 'AI Automation', pricing: 'Free', tags: ['AI', 'Automation'], url: 'https://n8n.io', gradient: 'linear-gradient(135deg, #ea580c, #f59e0b)' },
  { name: 'Supabase', domain: 'supabase.com', emoji: '🔵', score: 9.0, views: 890, favorites: 310, description: 'Open-source Firebase alternative — DB + Auth + Realtime + Storage.', category: 'AI Resources', pricing: 'Free', tags: ['Database', 'Auth'], url: 'https://supabase.com', gradient: 'linear-gradient(135deg, #065f46, #10b981)' },
  { name: 'Groq', domain: 'groq.com', emoji: '🤖', score: 8.8, views: 405, favorites: 76, description: 'Fastest LLM inference — 14,400 free req/day.', category: 'AI APIs', pricing: 'Free', tags: ['AI', 'LLM'], url: 'https://groq.com', gradient: 'linear-gradient(135deg, #831843, #f43f5e)' },
  { name: 'ElevenLabs', domain: 'elevenlabs.io', emoji: '🎙️', score: 8.2, views: 320, favorites: 45, description: 'AI voice generation and cloning.', category: 'AI Tools', pricing: 'Free', tags: ['AI', 'Voice'], url: 'https://elevenlabs.io', gradient: 'linear-gradient(135deg, #171717, #525252)' },
  { name: 'Spline', domain: 'spline.design', emoji: '🧊', score: 8.1, views: 275, favorites: 60, description: '3D design tool in the browser with AI generation capabilities.', category: '3D AI', pricing: 'Freemium', tags: ['3D', 'AI', 'Design'], url: 'https://spline.design', gradient: 'linear-gradient(135deg, #be185d, #fbbf24)' },
  { name: 'Resend', domain: 'resend.com', emoji: '✉️', score: 8.4, views: 310, favorites: 85, description: 'Developer-first email API — 3,000 emails/month free.', category: 'AI Marketing', pricing: 'Free', tags: ['Email', 'API'], url: 'https://resend.com', gradient: 'linear-gradient(135deg, #000000, #111111)' },
]
