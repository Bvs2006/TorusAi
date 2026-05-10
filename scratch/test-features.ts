// scratch/test-features.ts
import { askGroq } from '../lib/groq'

async function test() {
  const idea = "A task management app for students"
  const platform = "web"
  const stack = {
    frontend: { name: "Next.js" },
    backend: { name: "Node.js" },
    database: { name: "PostgreSQL" }
  }

  const stackContext = stack ? `
Tech Stack:
- Frontend: ${stack.frontend?.name}
- Backend: ${stack.backend?.name}
- Database: ${stack.database?.name}` : ''

  const prompt = `You are a Product Manager. Analyze this project idea and recommend 8-12 essential features.

Project Idea: "${idea}"
Platform: ${platform}
${stackContext}

Return ONLY a valid JSON array with no markdown formatting or code blocks. Each feature should have:
- name: feature name (string)
- description: what it does (string)
- priority: "must" (core/critical) or "nice" (enhancement) (string)
- complexity: "low", "medium", or "high" (string)
- why_important: brief explanation of why this feature matters for this specific idea (string)

Return ONLY valid JSON array.`

  try {
    console.log("Sending prompt to Groq...")
    const response = await askGroq(prompt, 1500)
    console.log("Raw Response:", response)
    
    let features = []
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      features = JSON.parse(jsonMatch[0])
      console.log("Parsed Features Count:", features.length)
    } else {
      features = JSON.parse(response)
      console.log("Parsed directly")
    }
  } catch (err) {
    console.error("Test failed:", err)
  }
}

test()
