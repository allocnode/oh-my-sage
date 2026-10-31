# AGENTS.md - oh-my-sage

## Project Overview

Xiaomi Mijia smart home AI Agent with dual-mode architecture:
- **Web Mode**: Next.js 14 + TypeScript + Ant Design + Vercel AI SDK
- **MCP Mode**: Model Context Protocol server for AI coding assistants

Communicates with Xiaomi gateway via WebSocket+ECJPAKE. Uses LLM tool-calling for smart home automation.

## Key Commands

```bash
# Web development
npm run dev              # Start Next.js dev server
npm run build            # Production build

# MCP development  
npm run build:mcp        # Build MCP server only
npm link                 # Link oh-my-sage-mcp command globally

# Quality checks
npm run lint             # ESLint (next/core-web-vitals)
npx tsc --noEmit         # TypeScript strict mode check
npx tsc --noEmit -p tsconfig.mcp.json   # MCP build type check

# Testing
npm run test:unit        # node:test via tsx, runs tests/**/*.test.ts
npx tsx --test <file>    # Run a single test file
```

**Note**: No Jest/Vitest. Unit tests use the built-in `node:test` runner through `tsx` and never touch a real gateway. The `npm run test` script points at `src/test.ts`, which does not exist; use `test:unit`.

## Dual Architecture

### Web Mode (`src/`)
- `src/app/` - Next.js App Router, API routes, pages
- `src/components/` - React UI (Chat, DevicePanel, etc.)
- `src/server/` - Backend: AI/LLM integration, Agent core, shared gateway singleton, Session store, Skill loader

### MCP Mode (`src/core/` + `src/mcp/`)
- `src/core/` - Shared Core library (tools, gateway client, types), also used by Web mode
- `src/mcp/` - MCP Server implementation
- `dist/mcp/` - Build output for MCP

## MCP Development

**Building**: `npm run build:mcp` outputs to `dist/mcp/mcp/index.js`

**Global command**: `npm link` creates `oh-my-sage-mcp` in PATH

**Local testing**: `oh-my-sage-mcp` (stdio mode, default)

**HTTP mode**: `oh-my-sage-mcp --http` (or `MCP_TRANSPORT=http`) serves Streamable HTTP at `/mcp` plus `GET /healthz`. One long-lived process shares a single gateway login and draft store across all client sessions, so the one-time passcode survives client restarts. Env: `MCP_HTTP_HOST` (default `127.0.0.1`), `MCP_HTTP_PORT` (default `3790`), `MCP_AUTH_TOKEN` (required when not bound to loopback), `MCP_ALLOWED_HOSTS`, `MCP_SESSION_TTL_MINUTES`. Implementation in `src/mcp/http.ts`.

**Deployment modes** (user picks one at install; details in `deploy/README.md`):
- stdio: client spawns the process (default; heavy concurrency spams `MaxListenersExceededWarning` because of the MCP SDK stdio client's per-request `drain` listeners — log noise only, tools still succeed)
- Local PC service: `deploy/install-local.ps1` (Windows Scheduled Task) or `deploy/install-local.sh` (launchd / systemd --user), loopback only
- Private server: `Dockerfile` + `deploy/docker-compose.yml` + `deploy/.env.example`

**Docs layout**: `README.md` is the landing page and index only; deployment details, client config formats and env vars live in `deploy/README.md`. Keep heavy operational detail out of the root README.

**Configuration** (stdio; the package is not published to npm, so run `npm run build:mcp && npm link` first):
```json
{
  "mcpServers": {
    "oh-my-sage": {
      "command": "oh-my-sage-mcp",
      "env": { "GATEWAY_URL": "http://192.168.0.5" }
    }
  }
}
```

Client config shapes differ. `mcpServers` (`command` string + `env`) is the primary form shown in the docs; HTTP clients take `{"url": "http://127.0.0.1:3790/mcp", "headers": {"Authorization": "Bearer <token>"}}`. Some clients nest under their own key instead — for example OpenCode uses `mcp` with `"type": "local"`/`"command": [...]`/`"environment"`, and `"type": "remote"` with `"oauth": false` for HTTP.

**Client-agnostic docs**: this project targets any MCP host, not one client. Never make a single client the default voice or assume its config schema; a concrete client is fine only as a short labelled example alongside the generic form.

**Tool count**: 31 tools registered in `src/mcp/tools/` (auth 3, device 3, graph 12 + graph draft 6, variable 6, misc 1). Keep the README tool table in sync when adding or removing one.

**Output size**: tools return compact output by default. `mijia_get_graph` and `mijia_get_device` default to `detail="summary"`; pass `detail="full"` or `node_ids` for full objects. Prefer the compact rule text format (`docs/rule-text-format.md`, parser in `src/core/tools/ruleText.ts`): `mijia_get_graph format="text"` or `focus` to read, `mijia_patch_graph` with `add`/`replace`/`note`/`variables` to edit in one call, `mijia_put_graph_text` for whole-file sync (`scripts/rules.mjs`). Any change to the text format must keep the JSON -> text -> JSON round trip lossless; `nodesToText` falls back to a per-node `+{diff}` or `raw` line rather than dropping data. `mijia_update_graph` (full replace) is kept for compatibility. Both validators accept a saved rule `id`; `mijia_validate_graph_capabilities` reports problems via `valid=false`, not `isError`.

## Skill System

Progressive disclosure in `.agents/skills/`:
- Layer 1: Catalog (name + description, ~50 tokens)
- Layer 2: Instructions (full SKILL.md via `activate_skill` tool)  
- Layer 3: Resources (files in `references/` via `read_skill_file` tool)

**Critical Skill**: `mijia-automation` - Required for creating automation rules via MCP. Located at `.agents/skills/mijia-automation/SKILL.md`.

## Code Conventions

### Imports
```typescript
// External libs first, then internal
import { streamText } from 'ai';
import { z } from 'zod';
import { GatewayClient } from '../gateway/client';
import { createGatewayManager } from '@/core/gateway/manager';  // Use @/ alias (maps to src/) for cross-module
```

### TypeScript
- Strict mode enabled - handle nulls explicitly
- Prefer `interface` over `type` for objects
- Explicit return types on exported functions
- `any` acceptable for gateway API responses (pragmatic)

### Tool Definitions (`server/ai/tools-adapter.ts` or `mcp/tools/`)
- Use `zod` schemas with `.describe()` for LLM
- Tools never throw: Core functions return `{ success: boolean, ... }`; MCP tools convert failures into an `isError` result
- Wrap gateway calls in try/catch, return `{ success: false, error: string }`

### API Routes
- Use `export const runtime = 'nodejs'`
- SSE format: `data: ...

`, end with `data: [DONE]

`

### Naming
- Files: camelCase for utils, PascalCase for React components
- Interfaces: PascalCase
- Constants: UPPER_SNAKE_CASE  
- Tool names: snake_case strings

## State Management

- **No Redux/Zustand on server**
- Gateway: shared singleton via `server/gateway/shared.ts`
- Session: JSON file-based store (`server/session/store.ts`, data in `.sessionstore/`)
- Client: React hooks with prop drilling

## Environment

Copy `.env.example` to `.env`:
```env
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=your_key
LLM_MODEL=gpt-4o
# LLM_TEMPERATURE=0.7            # optional
GATEWAY_URL=http://192.168.0.5  # example only; there is no built-in default
```

## Comments

Chinese comments are used throughout - match existing style.
Use section dividers: `// ==================== Section Name ====================`
