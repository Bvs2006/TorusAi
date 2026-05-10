// lib/groq.ts
import Groq from 'groq-sdk'

// Collect all available Groq API keys
const getGroqKeys = () => {
  const keys = [
    process.env.GROQ_API_KEY,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
    process.env.GROQ_API_KEY_4,
  ].filter(Boolean) as string[];
  return keys.length > 0 ? keys : ['']; // Default to empty to prevent init crash
}

const groqKeys = getGroqKeys();
let currentKeyIndex = 0;

export let groq = new Groq({
  apiKey: groqKeys[currentKeyIndex],
})

export const GROQ_MODEL = 'llama-3.1-8b-instant'

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export async function askGroq(prompt: string, maxTokens = 1000): Promise<string> {
  const maxRetries = groqKeys.length;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const response = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: maxTokens,
      })
      return response.choices[0].message.content || ''
    } catch (error: any) {
      // Rotate keys for rate limits (429) OR invalid keys (401)
      if (error?.status === 429 || error?.status === 401) {
        attempts++;
        if (attempts < maxRetries) {
        currentKeyIndex = (currentKeyIndex + 1) % groqKeys.length;
        groq = new Groq({ apiKey: groqKeys[currentKeyIndex] });
        console.warn(`[Groq] ${error?.status === 429 ? 'Rate limit hit' : 'Invalid key'}. Error: ${error?.message || 'Unknown'}. Switching to key index ${currentKeyIndex}.`);
          await sleep(500); // small backoff before retrying
          continue;
        } else if (process.env.GEMINI_API_KEY) {
          console.warn('[Groq] All keys failed. Falling back to Gemini.');
          return await askGemini(prompt, maxTokens);
        } else {
          throw new Error('AI services are currently unavailable. Please check your API keys or wait a moment.');
        }
      }
      throw error;
    }
  }
  
  throw new Error('All Groq requests failed. Please try again in a moment.');
}

async function askGemini(prompt: string, maxTokens: number): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.3 }
      })
    }
  )
  const data = await res.json()
  if (!res.ok) {
    if (res.status === 429) {
      throw new Error('AI providers are currently rate limited. Please wait 30 seconds and try again.')
    }
    console.error('[Gemini] API error:', JSON.stringify(data))
    throw new Error(`Gemini API error: ${data?.error?.message || res.status}`)
  }
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  if (!text) {
    console.error('[Gemini] Empty response:', JSON.stringify(data))
    throw new Error('Gemini returned an empty response')
  }
  return text
}

export function parseJSON<T>(text: string): T | null {
  try {
    // Strip markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned) as T
  } catch (err) {
    console.error('[parseJSON] Failed to parse. Raw text (first 500 chars):', text?.slice(0, 500))
    return null
  }
}
