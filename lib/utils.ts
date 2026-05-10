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
  'All', 'LLMs', 'Image Generation', 'Video Generation', 'Audio & Music', 
  'Coding Assistants', 'Productivity & Writing', 'Design & UI', 'Data & Analytics',
  'Marketing & SEO', 'Automation & Agents', 'Search & Research', 'Developer Tools'
]

export const TOOLS_DB = [
  // --- LLMs & Chat ---
  { name: 'ChatGPT', domain: 'openai.com', emoji: '🧠', score: 9.8, description: 'The industry leader for conversational AI and reasoning.', category: 'LLMs', pricing: 'Freemium', tags: ['LLM', 'AI', 'Chat'], url: 'https://chat.openai.com', featured: true },
  { name: 'Claude', domain: 'anthropic.com', emoji: '🎭', score: 9.7, description: 'High-performance LLM known for constitutional AI and large context windows.', category: 'LLMs', pricing: 'Freemium', tags: ['LLM', 'AI', 'Context'], url: 'https://claude.ai', featured: true },
  { name: 'Gemini', domain: 'google.com', emoji: '✨', score: 9.5, description: 'Google\'s multimodal AI integrated across the ecosystem.', category: 'LLMs', pricing: 'Freemium', tags: ['LLM', 'AI', 'Multimodal'], url: 'https://gemini.google.com' },
  { name: 'Mistral AI', domain: 'mistral.ai', emoji: '🇫🇷', score: 9.2, description: 'Open-weight high-efficiency models from Europe.', category: 'LLMs', pricing: 'Free/Paid', tags: ['LLM', 'Open Source'], url: 'https://mistral.ai' },
  { name: 'Perplexity', domain: 'perplexity.ai', emoji: '🔍', score: 9.6, description: 'AI-powered search engine that provides citations.', category: 'Search & Research', pricing: 'Freemium', tags: ['Search', 'AI', 'Research'], url: 'https://perplexity.ai' },

  // --- Image Generation ---
  { name: 'Midjourney', domain: 'midjourney.com', emoji: '🎨', score: 9.7, description: 'The highest fidelity AI image generator via Discord.', category: 'Image Generation', pricing: 'Paid', tags: ['Image', 'Art', 'Design'], url: 'https://midjourney.com', featured: true },
  { name: 'DALL-E 3', domain: 'openai.com', emoji: '🖌️', score: 9.4, description: 'OpenAI\'s image generator with perfect prompt adherence.', category: 'Image Generation', pricing: 'Paid', tags: ['Image', 'OpenAI'], url: 'https://openai.com/dall-e-3' },
  { name: 'Stable Diffusion', domain: 'stability.ai', emoji: '🌀', score: 9.3, description: 'Open-source image generation with ultimate control.', category: 'Image Generation', pricing: 'Free', tags: ['Image', 'Open Source'], url: 'https://stability.ai' },
  { name: 'Leonardo.ai', domain: 'leonardo.ai', emoji: '🦁', score: 9.1, description: 'Web-based image generation with advanced tuning.', category: 'Image Generation', pricing: 'Freemium', tags: ['Image', 'Gaming'], url: 'https://leonardo.ai' },

  // --- Video Generation ---
  { name: 'Sora', domain: 'openai.com', emoji: '📹', score: 9.9, description: 'Realistic 60-second video generation from text.', category: 'Video Generation', pricing: 'Coming Soon', tags: ['Video', 'Realism'], url: 'https://openai.com/sora', featured: true },
  { name: 'Runway Gen-3', domain: 'runwayml.com', emoji: '🎬', score: 9.6, description: 'Professional AI video editing and generation suite.', category: 'Video Generation', pricing: 'Paid', tags: ['Video', 'VFX'], url: 'https://runwayml.com' },
  { name: 'Luma Dream Machine', domain: 'lumalabs.ai', emoji: '🌌', score: 9.4, description: 'High-quality realistic video from text and images.', category: 'Video Generation', pricing: 'Freemium', tags: ['Video', 'Luma'], url: 'https://lumalabs.ai' },
  { name: 'Pika Art', domain: 'pika.art', emoji: '🎞️', score: 9.0, description: 'Creative AI animation and video generator.', category: 'Video Generation', pricing: 'Freemium', tags: ['Video', 'Animation'], url: 'https://pika.art' },

  // --- Audio & Music ---
  { name: 'Suno AI', domain: 'suno.com', emoji: '🎵', score: 9.8, description: 'Generate full songs with lyrics and vocals.', category: 'Audio & Music', pricing: 'Freemium', tags: ['Music', 'Audio'], url: 'https://suno.com', featured: true },
  { name: 'Udio', domain: 'udio.com', emoji: '🎹', score: 9.7, description: 'Professional grade high-fidelity music generation.', category: 'Audio & Music', pricing: 'Freemium', tags: ['Music', 'High-Fi'], url: 'https://udio.com' },
  { name: 'ElevenLabs', domain: 'elevenlabs.io', emoji: '🎙️', score: 9.8, description: 'The best AI text-to-speech and voice cloning.', category: 'Audio & Music', pricing: 'Freemium', tags: ['Speech', 'Voice'], url: 'https://elevenlabs.io' },

  // --- Coding Assistants ---
  { name: 'Cursor', domain: 'cursor.sh', emoji: '⚡', score: 9.9, description: 'AI-first code editor that knows your whole codebase.', category: 'Coding Assistants', pricing: 'Freemium', tags: ['Code', 'IDE'], url: 'https://cursor.com', featured: true },
  { name: 'GitHub Copilot', domain: 'github.com', emoji: '🐙', score: 9.6, description: 'The standard AI pair programmer for every IDE.', category: 'Coding Assistants', pricing: 'Paid', tags: ['Code', 'Autocomplete'], url: 'https://github.com/features/copilot' },
  { name: 'Replit Agent', domain: 'replit.com', emoji: '🌀', score: 9.5, description: 'Build and deploy entire apps from scratch via chat.', category: 'Coding Assistants', pricing: 'Paid', tags: ['Code', 'Deployment'], url: 'https://replit.com' },
  { name: 'Bolt.new', domain: 'bolt.new', emoji: '🔩', score: 9.4, description: 'Full-stack web development in the browser.', category: 'Coding Assistants', pricing: 'Freemium', tags: ['Code', 'Browser'], url: 'https://bolt.new' },

  // --- Productivity & Writing ---
  { name: 'Notion AI', domain: 'notion.so', emoji: '📓', score: 9.3, description: 'AI integrated directly into your notes and docs.', category: 'Productivity & Writing', pricing: 'Paid', tags: ['Notes', 'Writing'], url: 'https://notion.so' },
  { name: 'Jasper', domain: 'jasper.ai', emoji: '✍️', score: 9.0, description: 'AI writing assistant for enterprise marketing teams.', category: 'Productivity & Writing', pricing: 'Paid', tags: ['Writing', 'Marketing'], url: 'https://jasper.ai' },
  { name: 'Copy.ai', domain: 'copy.ai', emoji: '📝', score: 8.9, description: 'GTM AI platform for sales and marketing content.', category: 'Productivity & Writing', pricing: 'Freemium', tags: ['Writing', 'Sales'], url: 'https://copy.ai' },

  // --- Design & UI ---
  { name: 'v0.dev', domain: 'v0.dev', emoji: '🔮', score: 9.6, description: 'Generate UI components from text prompts using Shadcn.', category: 'Design & UI', pricing: 'Freemium', tags: ['UI', 'Frontend'], url: 'https://v0.dev', featured: true },
  { name: 'Canva Magic Studio', domain: 'canva.com', emoji: '🎨', score: 9.2, description: 'Suite of AI design tools for non-designers.', category: 'Design & UI', pricing: 'Freemium', tags: ['Design', 'Graphic'], url: 'https://canva.com' },
  { name: 'Framer AI', domain: 'framer.com', emoji: '🖼️', score: 9.1, description: 'Design and publish whole websites in seconds.', category: 'Design & UI', pricing: 'Freemium', tags: ['Web', 'Design'], url: 'https://framer.com' },

  // --- Automation & Agents ---
  { name: 'Zapier Central', domain: 'zapier.com', emoji: '⚙️', score: 9.4, description: 'AI agents that can take actions across 6,000+ apps.', category: 'Automation & Agents', pricing: 'Freemium', tags: ['Automation', 'Workflow'], url: 'https://zapier.com', featured: true },
  { name: 'n8n', domain: 'n8n.io', emoji: '🔄', score: 9.2, description: 'Low-code automation tool for technical teams.', category: 'Automation & Agents', pricing: 'Free/Paid', tags: ['Automation', 'Open Source'], url: 'https://n8n.io' },
  { name: 'CrewAI', domain: 'crewai.com', emoji: '👥', score: 9.3, description: 'Framework for orchestrating role-playing AI agents.', category: 'Automation & Agents', pricing: 'Free', tags: ['Agents', 'Python'], url: 'https://crewai.com' },

  // --- Developer Tools ---
  { name: 'Groq', domain: 'groq.com', emoji: '🏎️', score: 9.8, description: 'The world\'s fastest inference engine for LLMs.', category: 'Developer Tools', pricing: 'Freemium', tags: ['API', 'Speed'], url: 'https://groq.com', featured: true },
  { name: 'Pinecone', domain: 'pinecone.io', emoji: '🌲', score: 9.4, description: 'Vector database for high-performance AI applications.', category: 'Developer Tools', pricing: 'Freemium', tags: ['Vector', 'DB'], url: 'https://pinecone.io' },
  { name: 'LangChain', domain: 'langchain.com', emoji: '🦜', score: 9.5, description: 'The leading framework for building LLM applications.', category: 'Developer Tools', pricing: 'Free', tags: ['Framework', 'Python'], url: 'https://langchain.com' },
  { name: 'Firecrawl', domain: 'firecrawl.dev', emoji: '🔥', score: 9.3, description: 'Turn websites into LLM-ready clean data.', category: 'Developer Tools', pricing: 'Freemium', tags: ['Scraping', 'Data'], url: 'https://firecrawl.dev' },
]
