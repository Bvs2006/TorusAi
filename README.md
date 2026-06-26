# Torus AI

> Build anything. Ship everything.

AI-powered project planning platform. Describe your idea → get the perfect tech stack (via live web search) → visual architecture → exact prompts for every build phase.

**Cost: $0/month** — runs entirely on free tiers.

---

## Quick Start (5 steps)

### 1. Clone & install
```bash
git clone https://github.com/yourusername/torus-ai
cd torus-ai
npm install
```

### 2. Create accounts (all free)
| Service | URL | What for |
|---------|-----|----------|
| Firebase | firebase.google.com | Database + Auth |
| Groq | console.groq.com | AI (14,400 req/day free) |
| Vercel | vercel.com | Hosting |

### 3. Set up environment
```bash
cp .env.example .env.local
# Fill in your keys from each service
```

### 4. Configure Firebase
Enable **Authentication** and **Firestore Database** in the Firebase Console.

### 5. Start SearXNG (web search)
```bash
docker run -d --name searxng -p 8080:8080 searxng/searxng
```

### 6. Run the app
```bash
npm run dev
# Open http://localhost:3000
```

---

## Project Structure

```
torus-ai/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login
│   │   └── signup/page.tsx         # Sign up
│   ├── (app)/
│   │   ├── layout.tsx              # App shell (auth guard)
│   │   ├── dashboard/page.tsx      # Main dashboard
│   │   ├── planner/
│   │   │   ├── page.tsx            # Step 1: Idea input
│   │   │   ├── features/page.tsx   # Step 2: Features
│   │   │   ├── architecture/page.tsx # Step 3: Architecture
│   │   │   ├── prompts/page.tsx    # Step 4: Prompts ← core value
│   │   │   ├── blueprint/page.tsx  # Step 5: Blueprint
│   │   │   └── deploy/page.tsx     # Step 6: Deploy
│   │   ├── tools/page.tsx          # Tool Hub (18 tools)
│   │   ├── error-fix/page.tsx      # Error Fix Assistant
│   │   ├── badges/page.tsx         # Achievement Badges
│   │   └── settings/page.tsx       # User Settings
│   └── api/
│       ├── ai/plan/route.ts        # SearXNG + Groq plan generator
│       ├── ai/prompt/route.ts      # Phase prompt generator
│       ├── ai/fix/route.ts         # Error fix
│       ├── ai/propose/route.ts     # Client proposal (org)
│       ├── auth/session/route.ts   # Firebase session cookie
├── components/
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   └── ui.tsx                      # All reusable components
├── lib/
│   ├── groq.ts                     # Groq client + Gemini fallback
│   ├── searxng.ts                  # Web search + fallback
│   └── utils.ts                    # Helpers + tools DB
├── types/index.ts                  # TypeScript types
└── utils/firebase/                 # Firebase client/admin utilities
```

---

## How the AI works

```
User submits idea
       ↓
5 parallel SearXNG searches
(frontend, backend, db, auth, AI service)
       ↓
Groq (Llama 3.3 70B) selects optimal tools
based on search results + user context
       ↓
Generate 7-phase build plan
       ↓
Save to Firebase Firestore (projects + phases + features)
       ↓
User navigates through phases
       ↓
Each phase: Groq writes specific prompt
for chosen tool (Cursor/Windsurf/Bolt.new)
       ↓
User copies prompt → pastes into their IDE
```

---

## Torus MCP (IDE integration)

Add Torus planning to Cursor, VS Code Copilot, or Claude Desktop.

| Mode | When to use | Config |
|------|-------------|--------|
| **Remote HTTP** | Production (recommended) | `"url": "https://your-app.vercel.app/api/mcp"` |
| **Local stdio** | Local dev | `npm run mcp` with `TORUS_BASE_URL=http://localhost:3000` |

**Quick install:** run the app and open `/mcp` for a one-click Cursor install link and generated `mcp.json`.

**Full MCP deploy guide:** see [mcp/README.md](mcp/README.md)

Example remote config (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "torus-ai-builder": {
      "url": "https://your-app.vercel.app/api/mcp"
    }
  }
}
```

The MCP server deploys automatically with the Next.js app — no separate hosting step. After Vercel deploy, add the URL above to your IDE and ask: *"Use Torus to plan my idea."*

---

## Deploy to production

### 1. Push to GitHub
```bash
git add . && git commit -m "Initial commit" && git push
```

### 2. Deploy SearXNG to Railway
- railway.app → New → Deploy from Docker → `searxng/searxng`
- Set `SEARXNG_SECRET_KEY=<random>` env var
- Copy the Railway URL

### 3. Deploy to Vercel
```bash
npx vercel --prod
```
Add all env vars in Vercel dashboard. Update `SEARXNG_BASE_URL` to Railway URL.

### 4. Configure Firebase for production
- Authentication → URL Configuration → add your Vercel URL
- Add your Firebase env vars in Vercel, including `FIREBASE_SERVICE_ACCOUNT_JSON`

---

## Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | Next.js 14 (App Router) | Free |
| Database + Auth | Firebase | Free tier |
| AI Inference | Groq (Llama 3.3 70B) | Free (14.4k req/day) |
| AI Fallback | Google Gemini Flash | Free (1.5k req/day) |
| Web Search | SearXNG (self-hosted) | Free |
| Hosting | Vercel | Free |
| Email | Resend | Free (3k/month) |
| **Total** | | **$0/month** |

---

## License

MIT — build with it, fork it, ship it.
