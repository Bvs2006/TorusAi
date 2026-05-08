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

export const GROQ_MODEL = 'llama-3.3-70b-versatile'

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
      if (error?.status === 429) {
        attempts++;
        if (attempts < maxRetries) {
          // Switch to the next key
          currentKeyIndex = (currentKeyIndex + 1) % groqKeys.length;
          groq = new Groq({ apiKey: groqKeys[currentKeyIndex] });
          console.warn(`[Groq] Rate limit hit. Switching to key index ${currentKeyIndex}.`);
          continue; // Retry with new key
        } else if (process.env.GEMINI_API_KEY) {
          console.warn('[Groq] All keys rate limited. Falling back to Gemini.');
          return await askGemini(prompt, maxTokens);
        }
      }
      throw error;
    }
  }
  
  throw new Error('All Groq requests failed.');
}

async function askGemini(prompt: string, maxTokens: number): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

export function parseJSON<T>(text: string): T | null {
  try {
    // Strip markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned) as T
  } catch {
    return null
  }
}
