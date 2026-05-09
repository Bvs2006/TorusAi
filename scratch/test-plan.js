const { search } = require('../lib/searxng');
const { askGroq, parseJSON } = require('../lib/groq');

async function test() {
  const idea = "a saas product to remove image background";
  const platform = "web";
  const experience = "intermediate";
  const budget = "free";

  try {
    console.log("Searching...");
    const budgetFilter = budget === 'free' ? 'free tier only' : '';
    const [frontendResults, backendResults, dbResults, authResults, aiResults] = await Promise.all([
      search(`best ${platform} frontend framework ${budgetFilter} 2025`),
      search(`best backend API framework ${platform} ${budgetFilter} 2025`),
      search(`best database app ${budgetFilter} 2025`),
      search(`best authentication library ${platform} ${budgetFilter} 2025`),
      search(`best AI API LLM ${budgetFilter} 2025`),
    ]);

    console.log("Search completed. Querying Groq...");
    const prompt = `You are Torus AI, a project planning expert. Analyze the search results and select the BEST technology stack for this project.

PROJECT DETAILS:
- Idea: "${idea}"
- Platform: ${platform}
- Developer Experience: ${experience}
- Budget: ${budget}
- Target Users: General users
- Key Features: Standard features

CURRENT SEARCH RESULTS:
Frontend options: ${frontendResults.map(r => r.title).join(', ')}
Backend options: ${backendResults.map(r => r.title).join(', ')}
Database options: ${dbResults.map(r => r.title).join(', ')}
Auth options: ${authResults.map(r => r.title).join(', ')}
AI Service options: ${aiResults.map(r => r.title).join(', ')}

Based on these results, select the BEST tool for each category for this SPECIFIC project.
Prioritize: free tier availability (if budget=free), ease of use (if beginner), performance.

Respond with ONLY valid JSON, no markdown:
{
  "stack": {
    "frontend": {"name": "Next.js", "reason": "Best for web with built-in routing and Vercel deployment", "free": true},
    "backend": {"name": "Next.js API Routes", "reason": "Zero extra setup, deploys with frontend", "free": true},
    "database": {"name": "Supabase", "reason": "Free 500MB + Auth + Realtime included", "free": true},
    "auth": {"name": "Supabase Auth", "reason": "Free OAuth + email, integrated with DB", "free": true},
    "ai": {"name": "Groq", "reason": "14,400 free req/day, fastest inference", "free": true},
    "deployment": {"name": "Vercel", "reason": "Zero-config Next.js, free tier", "free": true}
  },
  "phases": [
    {"phase_number": 1, "name": "Project Setup & Config", "tool": "Cursor", "duration": "2-3h"}
  ],
  "estimated_hours": 23,
  "complexity": "medium"
}`;

    const raw = await askGroq(prompt, 1200);
    console.log("Groq responded:", raw);
    const plan = parseJSON(raw);
    console.log("Parsed:", plan);
  } catch (err) {
    console.error("Error during test:", err);
  }
}

test();
