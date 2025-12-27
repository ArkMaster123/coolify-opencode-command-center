# AGENTS.md - AI Command Center

## Commands
- `npm run dev` - Start dev server (port 3000)
- `npm run build` - Production build
- `npm run lint` - Run ESLint
- `npm start` - Start production server

## Architecture
- **Framework**: Next.js 15 + TypeScript + Tailwind CSS v4
- **AI Integration**: OpenCode SDK (`@opencode-ai/sdk`) with Grok models
- **UI**: Radix UI primitives, Lucide icons, Recharts
- **Path alias**: `@/*` → `./src/*`

## Structure
- `src/app/` - Next.js App Router pages and API routes
- `src/app/api/` - Server routes: chat, agents, projects, status, health
- `src/components/` - React components (ChatInterface, SystemMonitor, AgentManager, ProjectOverview)
- `src/components/ui/` - Reusable UI primitives
- `src/lib/utils.ts` - Utility functions (cn for classnames)

## Code Style
- Strict TypeScript (`strict: true`)
- ESLint with next/core-web-vitals and next/typescript configs
- Use `cn()` from `@/lib/utils` for conditional classnames
- Server-side API routes handle external service communication (no client-side secrets)
- Environment variables: `OPEN_CODE_SERVER_URL`, `NODE_ENV`, `PORT`
