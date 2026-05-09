import { NextResponse } from 'next/server'
import { generateAIResponse, AIProvider } from '@/lib/ai-router'
import { adminDb } from '@/utils/firebase/admin'

export async function POST(req: Request) {
  try {
    const { idea, platform, budget } = await req.json()

    if (!idea) {
      return NextResponse.json({ error: 'Idea is required' }, { status: 400 })
    }

    const systemPrompt = `You are an expert AI Software Architect and Team Planner.
Analyze the user's software project idea and provide a structured JSON response EXACTLY matching this format. Replace all placeholder text with YOUR ACTUAL GENERATED ANALYSIS based on the user's input.
Output ONLY valid JSON, with no markdown formatting or backticks outside the JSON:
{
  "summary": "<Write a 1 sentence description of what the project is>",
  "project_type": "<Determine the best category, e.g. SaaS Platform>",
  "complexity": "<Choose Low, Medium, or High>",
  "estimated_timeline": "<Estimate realistic timeline>",
  "suggested_stack": {
    "frontend": "<Suggest specific frontend tech>",
    "backend": "<Suggest specific backend tech>",
    "database": "<Suggest specific database tech>"
  },
  "required_roles": [
    { "title": "<Role title>", "description": "<What this role does>", "status": "pending", "progress": 0 }
  ],
  "custom_workflow_stages": [
    { "id": "stage-1", "title": "<Stage Name>", "owner_role": "<Role from required_roles>", "estimated_time": "<Time>" }
  ],
  "ai_opportunities": [
    "<Suggest an AI feature or integration>"
  ]
}
Ensure the output is ONLY valid, parseable JSON.`

    const userPrompt = `Project Idea: ${idea}\nPlatform: ${platform}\nBudget: ${budget}`

    const result = await generateAIResponse(systemPrompt, userPrompt)

    // Robust JSON extraction
    let parsed: any = null
    const text = result.content
    try {
      parsed = JSON.parse(text)
    } catch {
      try {
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        parsed = JSON.parse(cleaned)
      } catch {
        const firstBrace = text.indexOf('{')
        const lastBrace = text.lastIndexOf('}')
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          const candidate = text.substring(firstBrace, lastBrace + 1)
          try {
            parsed = JSON.parse(candidate)
          } catch (e) {
            console.error('Failed to parse candidate JSON:', candidate)
            throw new Error('AI response contains invalid JSON syntax.')
          }
        } else {
          throw new Error('AI response did not contain a valid JSON object.')
        }
      }
    }
    
    // Save to Firestore using Admin SDK
    const projectId = Date.now().toString()
    const projectToSave = {
      ...parsed,
      id: projectId,
      name: idea.length > 30 ? idea.substring(0, 30) + '...' : idea,
    }
    
    await adminDb.collection('team_projects').doc(projectId).set({
      ...projectToSave,
      created_at: new Date()
    })

    return NextResponse.json({ ...parsed, projectId })
  } catch (error: any) {
    console.error('Team Analyze Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to analyze project' }, { status: 500 })
  }
}
