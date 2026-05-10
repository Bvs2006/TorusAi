// types/index.ts

export interface User {
  id: string
  email: string
  username?: string
  streak_count: number
  badges: Badge[]
  created_at: string
}

export interface Streak {
  id: string
  user_id: string
  current_streak: number
  max_streak: number
  last_activity_date: string
  streak_started_at: string
  streak_ends_at?: string
  created_at: string
  updated_at: string
}

export interface UserActivity {
  id: string
  user_id: string
  activity_date: string
  activity_type: 'project_created' | 'feature_added' | 'phase_completed' | 'error_fixed' | 'ai_plan_generated' | 'prompt_generated'
  activity_data: Record<string, any>
  created_at: string
}

export interface StreakBadge {
  id: string
  user_id: string
  badge_type: '1_month' | '3_months' | '6_months' | '12_months' | '24_months'
  earned_at: string
  streak_value: number
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
  why_important?: string
  suitability_score?: number
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
