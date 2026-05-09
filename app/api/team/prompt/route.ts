import { NextResponse } from 'next/server'
import { generateAIResponse, AIProvider } from '@/lib/ai-router'

export async function POST(req: Request) {
  try {
    const { action, role, task, stack, prompt, provider } = await req.json()

    let systemPrompt = ''
    let userPrompt = ''

    if (action === 'generate') {
      systemPrompt = `You are an expert Prompt Engineer for software development.
Generate a highly structured, professional prompt that the user can copy-paste into an AI tool (like Cursor or v0).
The prompt should include: context, exact requirements, tech stack constraints, format expectations, and what NOT to do.
Output ONLY the generated prompt, nothing else.`
      
      userPrompt = `Role: ${role}\nTask: ${task}\nTech Stack: ${stack}`
    } else if (action === 'improve') {
      systemPrompt = `You are an expert Prompt Engineer for software development.
The user has provided a weak, vague prompt. Rewrite it to be a highly structured, professional prompt for an AI tool.
Make it specific, include the tech stack constraints, expected output format, and best practices.
Output ONLY the improved prompt, nothing else.`
      
      userPrompt = `Original Prompt: ${prompt}\nTech Stack Context: ${stack}`
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const result = await generateAIResponse(systemPrompt, userPrompt, provider as AIProvider)

    // Clean up if it's wrapped in markdown
    let finalPrompt = result.content
    if (finalPrompt.startsWith('\`\`\`')) {
      finalPrompt = finalPrompt.replace(/\`\`\`.*?\n/, '').replace(/\`\`\`$/, '').trim()
    }

    return NextResponse.json({ 
      prompt: finalPrompt,
      ai_provider: result.provider,
      ai_model: result.model
    })
  } catch (error: any) {
    console.error('Prompt API Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to process prompt' }, { status: 500 })
  }
}
