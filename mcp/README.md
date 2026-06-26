# Torus AI MCP Server

Torus exposes an MCP (Model Context Protocol) server so IDEs like **Cursor**, **VS Code + Copilot**, and **Claude Desktop** can plan projects directly from the editor.

## What it does

The `torus_build_idea` tool takes a product idea and returns:

- Feature list (must-have + optional)
- Architecture and tech stack
- Phased development guide with IDE prompts
- Deployment steps
- Recommended AI tools and services

---

## Two ways to run MCP

| Mode | Best for | How it works |
|------|----------|--------------|
| **Remote HTTP** (recommended) | Production, team sharing | MCP lives at `/api/mcp` on your deployed Torus app |
| **Local stdio** | Local dev, offline IDE bridge | `mcp/torus-mcp-server.mjs` talks to Torus over HTTP |

---

## Option A — Remote HTTP MCP (production)

Deploy the Torus Next.js app first. The MCP endpoint is included automatically — no separate MCP deploy step.

### 1. Deploy Torus to Vercel

```bash
# From project root
npm install
npm run build          # verify build passes
npx vercel --prod
```

In the Vercel dashboard → **Settings → Environment Variables**, add everything from `.env.example`:

- `NEXT_PUBLIC_FIREBASE_*` (all Firebase client vars)
- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `GROQ_API_KEY` (and optional fallback keys)
- `GEMINI_API_KEY`
- `SEARXNG_BASE_URL` (Railway or other hosted SearXNG URL)
- `NEXT_PUBLIC_APP_URL` → your Vercel URL, e.g. `https://torus-ai.vercel.app`

Redeploy after adding env vars.

### 2. Verify the MCP endpoint

```bash
curl https://YOUR-APP.vercel.app/api/mcp
```

Expected response:

```json
{
  "name": "torus-ai-builder",
  "version": "1.0.0",
  "transport": "streamable-http",
  "endpoint": "/api/mcp",
  "tools": ["torus_build_idea"]
}
```

### 3. Add to your IDE

**Cursor** — open [your-app]/mcp or use the one-click install link on `/mcp`.

**Manual `mcp.json` (production):**

```json
{
  "mcpServers": {
    "torus-ai-builder": {
      "url": "https://torusai.vercel.app/api/mcp"
    }
  }
}
```

| IDE | Config file location |
|-----|---------------------|
| Cursor (project) | `.cursor/mcp.json` |
| Cursor (global) | `~/.cursor/mcp.json` |
| VS Code Copilot | `.vscode/mcp.json` |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) |

### 4. Test in Cursor

Ask:

> Use Torus to plan my idea: a habit tracker app with streaks and badges.

The IDE should call `torus_build_idea` and return a full project plan.

---

## Option B — Local stdio MCP (development)

Use this when Torus runs locally (`npm run dev`) or when your IDE only supports stdio MCP servers.

### 1. Start Torus

```bash
npm run dev
# App at http://localhost:3000
```

### 2. Configure stdio MCP

```json
{
  "mcpServers": {
    "torus-ai-builder": {
      "command": "node",
      "args": ["mcp/torus-mcp-server.mjs"],
      "env": {
        "TORUS_BASE_URL": "http://localhost:3000"
      }
    }
  }
}
```

Use an **absolute path** to `torus-mcp-server.mjs` if your IDE cwd differs from the project root.

### 3. Run manually (debug)

```bash
npm run mcp
# or
TORUS_BASE_URL=http://localhost:3000 node mcp/torus-mcp-server.mjs
```

Stdio MCP reads JSON-RPC from stdin and writes responses to stdout. Keep `npm run dev` running in another terminal so AI routes respond.

### 4. Point stdio MCP at production

```json
{
  "mcpServers": {
    "torus-ai-builder": {
      "command": "node",
      "args": ["C:/path/to/TorusAi/mcp/torus-mcp-server.mjs"],
      "env": {
        "TORUS_BASE_URL": "https://YOUR-APP.vercel.app"
      }
    }
  }
}
```

---

## Environment variables

| Variable | Used by | Description |
|----------|---------|-------------|
| `TORUS_BASE_URL` | stdio MCP (`torus-mcp-server.mjs`) | Base URL of the Torus app (default: `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | `/mcp` install page | Public app URL shown in generated `mcp.json` |
| `GROQ_API_KEY` | Torus API routes | Required for real AI plans (fallback data used if missing) |

---

## Architecture

```
IDE (Cursor / VS Code / Claude)
        │
        ├─ Remote HTTP ──► https://your-app.vercel.app/api/mcp
        │                         │
        │                         ├─► /api/ai/features
        │                         ├─► /api/ai/plan
        │                         └─► /api/ai/recommend-tools
        │
        └─ Local stdio ──► mcp/torus-mcp-server.mjs
                                    │
                                    └──► TORUS_BASE_URL/api/ai/*
```

Remote HTTP is simpler for teams: one Vercel deploy, no local Node process in the IDE.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| MCP tool not listed in IDE | Restart IDE after saving `mcp.json` |
| `idea is required` error | Pass a non-empty `idea` argument |
| Empty or fallback plan data | Check `GROQ_API_KEY` on Vercel; confirm `/api/ai/plan` works |
| Tool returns generic fallback data | Redeploy after middleware fix — `/api/ai` must be reachable from MCP |
| stdio MCP hangs | Ensure `npm run dev` is running and `TORUS_BASE_URL` is correct |
| CORS errors (remote) | `/api/mcp` allows all origins; use HTTPS in production |
| 401 on app pages | `/api/mcp` is public; auth is not required for MCP |

---

## Files

| File | Purpose |
|------|---------|
| `app/api/mcp/route.ts` | Remote HTTP MCP (deployed with Next.js) |
| `mcp/torus-mcp-server.mjs` | Local stdio MCP bridge |
| `app/mcp/page.tsx` | Install page with live `mcp.json` |
| `mcp/mcp.json.example` | Copy-paste configs for Cursor / VS Code |
