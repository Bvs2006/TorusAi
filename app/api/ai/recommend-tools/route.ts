// app/api/ai/recommend-tools/route.ts
import { askGroq } from '@/lib/groq'

export async function POST(req: Request) {
  try {
    const { projectIdea, features, platform, stack } = await req.json()

    const prompt = `You are an expert AI tools architect. Based on the project requirements, recommend the BEST AI tools for different layers.

Project Idea: "${projectIdea}"
Platform: ${platform}
Features: ${features?.map((f: any) => f.name || f.title).filter(Boolean).join(', ') || 'Not specified'}
Tech Stack: ${JSON.stringify(stack)}

Recommend AI tools organized by layer (Frontend, Backend, Data/ML, DevOps):

For each layer, recommend 2-3 SPECIFIC AI tools that would be most useful.

Format your response as ONLY valid JSON (no markdown, no code blocks):
{
  "tools": [
    {
      "id": "unique_id",
      "name": "Tool Name",
      "description": "Brief description",
      "category": "LLMs|Agents|Image Generation|Speech-to-Text|Search|Vector DB|Code|Embeddings",
      "layer": "Frontend|Backend|Data|DevOps",
      "level": 1,
      "reason": "Why this tool is recommended for this specific project",
      "relevance": 95,
      "configuration": "Step-by-step guide: 1. Get API key from tool's dashboard. 2. Add to .env.local file as NEXT_PUBLIC_TOOL_API_KEY. 3. Initialize in your code with the API key. 4. For Frontend: use client-side SDK or API calls. For Backend: use server-side SDK with authentication. For Data: set up data pipelines and vector storage. For DevOps: configure deployment settings and monitoring."
    }
  ]
}

Example tools by category:
- LLMs: GPT-4, Claude 3, Gemini Pro, Llama 2, Mistral
- Agents: AutoGPT, AgentGPT, LangChain, CrewAI
- Image Generation: DALL-E 3, Midjourney, Stable Diffusion, Leonardo.Ai
- Speech-to-Text: Whisper, Rev, Descript
- Search: Tavily, Perplexity, You.com Search
- Vector DB: Pinecone, Weaviate, Supabase Vector, Milvus
- Code: GitHub Copilot, Tabnine, Cursor
- Embeddings: OpenAI Embeddings, Cohere, Hugging Face

RESPOND ONLY WITH JSON:`

    const response = await askGroq(prompt, 2000)
    
    let jsonStr = response.trim()
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.split('```json')[1].split('```')[0].trim()
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.split('```')[1].split('```')[0].trim()
    }
    
    const result = JSON.parse(jsonStr)
    
    return Response.json({
      tools: result.tools || []
    })
  } catch (error: any) {
    console.error('Tools recommendation error:', error)
    return Response.json({ 
      tools: [],
      error: error.message
    }, { status: 200 })
  }
}
