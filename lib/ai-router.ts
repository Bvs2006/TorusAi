import { groq } from './groq'

export type AIProvider = 'groq' | 'gemini' | 'openrouter'

export interface AIResponse {
  content: string
  provider: AIProvider
  model: string
}

export async function generateAIResponse(
  systemPrompt: string,
  userPrompt: string,
  preferredProvider?: AIProvider
): Promise<AIResponse> {
  const geminiKey = process.env.GEMINI_API_KEY
  const openRouterKey = process.env.OPENROUTER_API_KEY
  const groqKey = process.env.GROQ_API_KEY

  // Determine which provider to use based on preference and key availability
  let provider: AIProvider = 'groq'
  if (preferredProvider === 'gemini' && geminiKey) provider = 'gemini'
  if (preferredProvider === 'openrouter' && openRouterKey) provider = 'openrouter'
  
  // Fallbacks
  if (provider === 'groq' && !groqKey) {
    if (geminiKey) provider = 'gemini'
    else if (openRouterKey) provider = 'openrouter'
  }

  try {
    if (provider === 'gemini' && geminiKey) {
      const model = 'gemini-1.5-flash'
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
        })
      })
      if (!res.ok) throw new Error('Gemini API Error')
      const data = await res.json()
      return {
        content: data.candidates[0].content.parts[0].text,
        provider: 'gemini',
        model
      }
    }

    if (provider === 'openrouter' && openRouterKey) {
      const model = 'meta-llama/llama-3-8b-instruct:free'
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        })
      })
      if (!res.ok) throw new Error('OpenRouter API Error')
      const data = await res.json()
      return {
        content: data.choices[0].message.content,
        provider: 'openrouter',
        model
      }
    }

    // Default to Groq
    const model = 'llama-3.3-70b-versatile'
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model,
      temperature: 0.7,
    })
    return {
      content: completion.choices[0]?.message?.content || '',
      provider: 'groq',
      model
    }

  } catch (error) {
    console.error('AI Generation Error:', error)
    // Try fallback if primary fails
    if (provider !== 'groq' && groqKey) {
      console.log('Falling back to Groq...')
      return generateAIResponse(systemPrompt, userPrompt, 'groq')
    }
    throw error
  }
}
