// app/api/ai/all-tools/route.ts
import { askGroq } from '@/lib/groq'

export async function GET(req: Request) {
  try {
    const prompt = `You are an AI tools expert. Generate a comprehensive list of ALL available AI tools organized by category.

For each tool, provide:
- Unique ID
- Name
- Short description (1-2 sentences)
- Category (one of: LLMs, Agents, Image Generation, Speech-to-Text, Search, Vector DB, Code, Embeddings, Video, Audio, 3D, Analytics, Automation, Design, Other)
- Pricing (Free, Freemium, Paid)
- URL/Website

Format response as ONLY valid JSON (no markdown, no code blocks):
{
  "tools": [
    {
      "id": "unique_id",
      "name": "Tool Name",
      "description": "What it does and key features",
      "category": "Category Name",
      "pricing": "Free|Freemium|Paid",
      "website": "https://example.com"
    }
  ]
}

Generate 80-120 of the BEST and most popular AI tools. Include:

LLMs (10-15): GPT-4, Claude 3, Gemini Pro, Llama 2, Mistral, Cohere, Palm 2, etc.
Agents (8-12): AutoGPT, AgentGPT, LangChain, CrewAI, n8n, Zapier, Make, etc.
Image Generation (8-12): DALL-E 3, Midjourney, Stable Diffusion, Leonardo.Ai, Adobe Firefly, Hugging Face Spaces, etc.
Speech-to-Text (5-8): Whisper, Rev, Descript, Google Speech-to-Text, Azure Speech, etc.
Search (5-8): Tavily, Perplexity, You.com, DuckDuckGo API, Bing Search, etc.
Vector DB (6-10): Pinecone, Weaviate, Supabase Vector, Milvus, Qdrant, Chroma, etc.
Code (8-12): GitHub Copilot, Tabnine, Cursor, CodePilot, Codeium, Replit Ghost, etc.
Embeddings (5-8): OpenAI Embeddings, Cohere Embeddings, Hugging Face, SentenceTransformers, etc.
Video (5-8): Synthesia, Runway ML, Pika Labs, Descript, Adobe Firefly, etc.
Audio (5-8): ElevenLabs, Google Text-to-Speech, Azure Text-to-Speech, VALL-E, Bark, etc.
3D (4-6): Spline, Meshy, DreamFusion, NeRF, etc.
Analytics (5-8): Mixpanel, Amplitude, Looker, Tableau, PowerBI, Google Analytics, etc.
Automation (8-12): IFTTT, Zapier, Make, n8n, Integromat, RPA tools, etc.
Design (8-12): Figma AI, Adobe XD, Canva AI, Framer, Webflow, etc.
Other (5-8): ChatGPT plugins, Microsoft Copilot, Bard, etc.

RESPOND ONLY WITH JSON:`;

    const response = await askGroq(prompt, 2500)
    
    let jsonStr = response.trim()
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.split('```json')[1].split('```')[0].trim()
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.split('```')[1].split('```')[0].trim()
    }
    
    const result = JSON.parse(jsonStr)
    
    return Response.json({
      tools: result.tools || [],
      total: result.tools?.length || 0
    })
  } catch (error: any) {
    console.error('Error fetching all AI tools:', error)
    
    // Fallback list of popular AI tools
    const fallbackTools = [
      { id: 'gpt4', name: 'GPT-4', description: 'State-of-the-art large language model by OpenAI', category: 'LLMs', pricing: 'Paid', website: 'https://openai.com' },
      { id: 'claude', name: 'Claude 3', description: 'Advanced AI assistant by Anthropic', category: 'LLMs', pricing: 'Paid', website: 'https://anthropic.com' },
      { id: 'gemini', name: 'Gemini Pro', description: 'Multimodal AI model by Google', category: 'LLMs', pricing: 'Freemium', website: 'https://gemini.google.com' },
      { id: 'dalle3', name: 'DALL-E 3', description: 'Advanced image generation by OpenAI', category: 'Image Generation', pricing: 'Paid', website: 'https://openai.com/dall-e-3' },
      { id: 'midjourney', name: 'Midjourney', description: 'AI image generation tool', category: 'Image Generation', pricing: 'Paid', website: 'https://midjourney.com' },
      { id: 'copilot', name: 'GitHub Copilot', description: 'AI pair programmer', category: 'Code', pricing: 'Paid', website: 'https://github.com/features/copilot' },
      { id: 'tabnine', name: 'Tabnine', description: 'AI code completion for developers', category: 'Code', pricing: 'Freemium', website: 'https://tabnine.com' },
      { id: 'pinecone', name: 'Pinecone', description: 'Vector database for AI applications', category: 'Vector DB', pricing: 'Freemium', website: 'https://pinecone.io' },
      { id: 'whisper', name: 'OpenAI Whisper', description: 'Speech recognition model', category: 'Speech-to-Text', pricing: 'Free', website: 'https://openai.com/research/whisper' },
      { id: 'weaviate', name: 'Weaviate', description: 'Open-source vector search platform', category: 'Vector DB', pricing: 'Free', website: 'https://weaviate.io' }
    ]
    
    return Response.json({ 
      tools: fallbackTools,
      total: fallbackTools.length,
      error: error.message,
      note: 'Using fallback tool list'
    }, { status: 200 })
  }
}
