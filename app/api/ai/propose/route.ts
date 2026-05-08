// app/api/ai/propose/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { askGroq } from '@/lib/groq'

export async function POST(req: NextRequest) {
  try {
    const { project, clientName, tone, includePricing } = await req.json()

    const prompt = `Write a professional project proposal for client: ${clientName}

Project Details:
- Name: ${project.name}
- Description: ${project.idea}
- Platform: ${project.platform}
- Stack: ${project.stack ? Object.entries(project.stack).map(([k,v]: any) => `${k}: ${v.name}`).join(', ') : 'TBD'}
- Estimated Timeline: ${project.estimated_hours} hours across 7 phases
- Complexity: ${project.complexity || 'Medium'}

Tone: ${tone || 'professional'}
Include pricing: ${includePricing ? 'Yes - mention it is negotiable based on scope' : 'No'}

Write a compelling proposal that:
1. Opens with understanding of their needs
2. Explains our approach and methodology
3. Describes the tech stack and why it was chosen
4. Outlines the 7-phase delivery timeline
5. Mentions deliverables per phase
6. Closes with clear next steps

Keep it under 500 words. Professional, clear, and client-focused.`

    const content = await askGroq(prompt, 700)

    return NextResponse.json({ content })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
