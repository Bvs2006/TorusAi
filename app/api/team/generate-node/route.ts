import { NextResponse } from 'next/server'
import { generateAIResponse } from '@/lib/ai-router'
import { adminDb } from '@/utils/firebase/admin'

export async function POST(req: Request) {
  try {
    const { projectId, nodeId, nodeTitle, projectContext, roleContext } = await req.json()

    if (!projectId || !nodeId) {
      return NextResponse.json({ error: 'Missing projectId or nodeId' }, { status: 400 })
    }

    const systemPrompt = `You are an expert AI Software Engineering Manager.
The team is building a project. You need to generate a specific, highly detailed step-by-step execution plan for ONE specific stage of the workflow.
Output exactly this structured JSON format. Output ONLY valid JSON:
{
  "goal": "A clear, concise goal for this stage",
  "tools": [
    { "name": "E.g., Cursor", "desc": "E.g., AI-first code editor", "icon_name": "Terminal" }
  ],
  "why": "Brief explanation of why these tools are best for this stage.",
  "setup": [
    "Step 1: Do this",
    "Step 2: Do that"
  ],
  "prompt": "An exact, highly detailed AI prompt the user can copy-paste into an AI tool (like Cursor or v0) to complete this specific stage. Make it specific to their tech stack.",
  "expected": [
    "Expected outcome 1",
    "Expected outcome 2"
  ],
  "mistakes": [
    "Common mistake to avoid 1",
    "Common mistake to avoid 2"
  ],
  "next": "The logical next step after this stage is done."
}
Ensure the output is ONLY parseable JSON.`

    const userPrompt = `Project Summary: ${projectContext.summary}
Tech Stack: ${JSON.stringify(projectContext.suggested_stack)}
Role Executing This Task: ${roleContext}
Task Stage to Generate: ${nodeTitle}`

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
            console.error('Failed to parse candidate JSON in node generation:', candidate)
            throw new Error('AI response contains invalid JSON syntax.')
          }
        } else {
          throw new Error('AI response did not contain a valid JSON object.')
        }
      }
    }
    
    // Save generated node details to Firestore using Admin SDK
    await adminDb.collection('team_projects').doc(projectId)
      .collection('team_workflows').doc(nodeId)
      .set({
        ...parsed,
        id: nodeId,
        updated_at: new Date()
      }, { merge: true })

    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error('Generate Node Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate workflow node' }, { status: 500 })
  }
}
