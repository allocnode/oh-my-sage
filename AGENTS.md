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

# Testing (manual only, no automated framework)
npm run test             # Runs npx tsx src/test.ts
npx tsx <script.ts>      # Run single TypeScript file
```

**Note**: No Jest/Vitest. All tests are manual integration tests via `tsx`.

## Dual Architecture

### Web Mode (`src/`)
- `src/app/` - Next.js App Router, API routes, pages
- `src/components/` - React UI (Chat, DevicePanel, etc.)
- `src/server/` - Backend: AI/LLM integration, Agent core, Gateway client, Session store
- `src/shared/` - Types and constants

### MCP Mode (`src/core/` + `src/mcp/`)
- `src/core/` - Shared Core library (tools, gateway, types)
- `src/mcp/` - MCP Server implementation
- `dist/mcp/` - Build output for MCP

## MCP Development

**Building**: `npm run build:mcp` outputs to `dist/mcp/mcp/index.js`

**Global command**: `npm link` creates `oh-my-sage-mcp` in PATH

**Local testing**: `oh-my-sage-mcp` (stdio mode, default)

**HTTP mode**: `oh-my-sage-mcp --http` (or `MCP_TRANSPORT=http`) serves Streamable HTTP at `/mcp` plus `GET /healthz`. One long-lived process shares a single gateway login and draft store across all client sessions, so the one-time passcode survives client restarts. Env: `MCP_HTTP_HOST` (default `127.0.0.1`), `MCP_HTTP_PORT` (default `3790`), `MCP_AUTH_TOKEN` (required when not bound to loopback), `MCP_ALLOWED_HOSTS`, `MCP_SESSION_TTL_MINUTES`. Implementation in `src/mcp/http.ts`.

**Deployment modes** (user picks one at install; see README):
- stdio: client spawns the process (default; heavy concurrency spams warnings in OpenCode 1.19.x because of Bun + SDK stdio `drain` listeners)
- Local PC service: `deploy/install-local.ps1` (Windows Scheduled Task) or `deploy/install-local.sh` (launchd / systemd --user), loopback only
- Private server: `Dockerfile` + `deploy/docker-compose.yml` + `deploy/.env.example`

**Configuration** (stdio, for OpenCode/Claude/Cursor):
```json
{
  "mcpServers": {
    "oh-my-sage": {
      "command": "npx",
      "args": ["-y", "oh-my-sage-mcp"]
    }
  }
}
```

HTTP clients use `{"url": "http://127.0.0.1:3790/mcp", "headers": {"Authorization": "Bearer <token>"}}`; OpenCode uses `"type": "remote"` with `"oauth": false`.

**Output size**: tools return compact output by default. `mijia_get_graph` and `mijia_get_device` default to `detail="summary"`; pass `detail="full"` or `node_ids` for full objects. Edit existing rules with `mijia_patch_graph` (changed nodes only, `baseHash` from `mijia_get_graph`) rather than `mijia_update_graph` (full replace, kept for compatibility). Both validators accept a saved rule `id`; `mijia_validate_graph_capabilities` reports problems via `valid=false`, not `isError`.

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
import { Device } from '@/shared/types';  // Use @/ alias for cross-module
```

### TypeScript
- Strict mode enabled - handle nulls explicitly
- Prefer `interface` over `type` for objects
- Explicit return types on exported functions
- `any` acceptable for gateway API responses (pragmatic)

### Tool Definitions (`server/ai/tools.ts` or `mcp/tools/`)
- Use `zod` schemas with `.describe()` for LLM
- Tools return `{ success: boolean, ... }` - **never throw**
- Wrap gateway calls in try/catch, return `{ success: false, error: string }`

### API Routes
- Use `export const runtime = 'nodejs'`
- SSE format: `data: ...

`, end with `data: [DONE]

`

### Naming
- Files: camelCase for utils, kebab-case for components
- Interfaces: PascalCase
- Constants: UPPER_SNAKE_CASE  
- Tool names: snake_case strings

## State Management

- **No Redux/Zustand on server**
- Gateway: shared singleton via `server/gateway/shared.ts`
- Session: JSON file-based store (`server/session/store.ts`)
- Client: React hooks with prop drilling

## Environment

Copy `.env.example` to `.env`:
```env
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=your_key
LLM_MODEL=gpt-4o
GATEWAY_URL=http://192.168.0.5  # Xiaomi gateway default
```

## Comments

Chinese comments are used throughout - match existing style.
Use section dividers: `// ==================== Section Name ====================`
