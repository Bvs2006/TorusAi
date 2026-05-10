// scratch/test-gemini.ts
async function askGemini(prompt: string, maxTokens: number): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("No GEMINI_API_KEY found in env");
  
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
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
    console.error('[Gemini] API error:', JSON.stringify(data))
    throw new Error(`Gemini API error: ${data?.error?.message || res.status}`)
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function test() {
  try {
    console.log("Testing Gemini...")
    const res = await askGemini("Hello, how are you?", 100)
    console.log("Gemini Response:", res)
  } catch (err) {
    console.error("Gemini test failed:", err)
  }
}

test()
