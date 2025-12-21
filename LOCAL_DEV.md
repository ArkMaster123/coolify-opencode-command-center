# 🚀 Local Development Setup

## Quick Start

### Option 1: Use the Dev Script (Recommended)

```bash
# Make script executable (first time only)
chmod +x scripts/dev-local.sh

# Run the script - it starts OpenCode server AND Next.js
./scripts/dev-local.sh
```

This will:
1. ✅ Check if OpenCode CLI is installed
2. ✅ Start OpenCode server on port 4096
3. ✅ Start Next.js dev server on port 3000
4. ✅ Set environment variables automatically

### Option 2: Manual Setup

**Terminal 1 - Start OpenCode Server:**
```bash
opencode serve --hostname 127.0.0.1 --port 4096
```

**Terminal 2 - Start Next.js:**
```bash
npm run dev:local
```

Or with explicit env vars:
```bash
OPENCODE_MODE=client OPENCODE_SERVER_URL=http://127.0.0.1:4096 npm run dev
```

## Environment Variables

For local development, the app uses **CLIENT mode** to connect to your local OpenCode server:

- `OPENCODE_MODE=client` - Connect to existing server (not embedded)
- `OPENCODE_SERVER_URL=http://127.0.0.1:4096` - Local OpenCode server URL

## Verify It's Working

1. **Check OpenCode Server:**
   ```bash
   curl http://127.0.0.1:4096/config
   ```
   Should return JSON config.

2. **Check Next.js:**
   - Open http://localhost:3000
   - Should see "Connected" badge in chat
   - Status should be green

3. **Test Chat:**
   - Select a model (default: Grok Code Fast 1 - FREE!)
   - Send a message
   - Should get AI response

## Troubleshooting

### "Disconnected" Badge
- ✅ Make sure OpenCode server is running: `opencode serve --hostname 127.0.0.1 --port 4096`
- ✅ Check port 4096 is not blocked: `lsof -i :4096`
- ✅ Verify server responds: `curl http://127.0.0.1:4096/config`

### "Error with embedded OpenCode server"
- ✅ Make sure you're using `npm run dev:local` (not `npm run dev`)
- ✅ Check environment variables are set: `echo $OPENCODE_MODE`
- ✅ Restart both servers

### Port Already in Use
```bash
# Kill process on port 4096
lsof -ti:4096 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## Production vs Local

| Mode | Environment | How It Works |
|------|------------|--------------|
| **CLIENT** | Local Dev | Connects to `opencode serve` running separately |
| **EMBEDDED** | Production/Coolify | Starts OpenCode server inside Next.js app |

## Models Available

- 🆓 **opencode/grok-code-fast-1** (FREE - Default)
- 🆓 **opencode/big-pickle** (FREE)
- 🆓 **opencode/gpt-5-nano** (FREE)
- xai/grok-2
- anthropic/claude-3-5-sonnet-20241022
- openai/gpt-4o
- And more...

