// types/index.ts

export interface User {
  id: string
  email: string
  username?: string
  streak_count: number
  badges: Badge[]
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  idea: string
  platform: string
  experience: string
  budget: string
  status: 'active' | 'completed' | 'paused'
  stack?: Stack
  estimated_hours?: number
  created_at: string
  features?: Feature[]
  phases?: Phase[]
}

export interface Feature {
  id: string
  project_id: string
  name: string
  description: string
  priority: 'must' | 'nice'
  complexity: 'low' | 'medium' | 'high'
  sort_order: number
}

export interface Phase {
  id: string
  project_id: string
  name: string
  tool: string
  prompt?: string
  status: 'pending' | 'active' | 'done'
  phase_number: number
  duration?: string
}

export interface Stack {
  frontend: StackItem
  backend: StackItem
  database: StackItem
  auth: StackItem
  ai: StackItem
  deployment?: StackItem
}

export interface StackItem {
  name: string
  reason: string
  free: boolean
  docs_url?: string
}

export interface Badge {
  id: string
  name: string
  emoji: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earned_at: string
}

export interface Tool {
  name: string
  emoji: string
  score: number
  description: string
  category: string
  pricing: 'Free' | 'Freemium' | 'Paid'
  tags: string[]
  url: string
}

export interface AIPromptResponse {
  prompt: string
  tips: string[]
}

export interface AIPlanResponse {
  stack: Stack
  phases: Omit<Phase, 'id' | 'project_id' | 'status'>[]
  estimated_hours: number
  complexity: 'low' | 'medium' | 'high'
}

export interface AIFixResponse {
  explanation: string
  steps: string[]
  fixedPrompt: string
  relatedDocs?: string
}
