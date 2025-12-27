# 🚀 Quick Start Guide

## Two Separate Tools - Here's the Difference:

### 1. **Coolify** (Deployment Platform) ✅
- **What it is**: Your server deployment platform (like Heroku/Vercel)
- **What you need**: API URL + API Token (you already have the token!)
- **Status**: ✅ Token added to `.env.local`

### 2. **OpenCode** (AI Coding Agent) ⚠️
- **What it is**: AI coding assistant that powers the chat
- **What you need**: Install OpenCode CLI locally
- **Status**: Need to install (see below)

---

## ✅ Step 1: Coolify Setup (DONE!)

Your Coolify API token is already in `.env.local`:
```
COOLIFY_API_TOKEN=2|q8BSUhiV3jZ7PdEejsojFn5JezYwWEZCUKC9Ev3V8a9b9e98
```

**Just update the URL** if needed:
- If your Coolify is at `https://coolify.th3ark.com` → Keep it
- If it's at a different URL → Update `COOLIFY_API_URL` in `.env.local`

---

## ⚠️ Step 2: Install OpenCode (Required for Local Dev)

OpenCode is a **separate tool** that needs to be installed on your **local machine** (not on the server).

### Install OpenCode CLI:

```bash
# Install via npm (recommended)
npm install -g @opencode-ai/cli

# Or via curl (alternative)
curl -fsSL https://opencode.ai/install.sh | sh
```

### Verify Installation:

```bash
opencode --version
# Should show version number
```

### Start OpenCode Server (for local dev):

```bash
opencode serve --hostname 127.0.0.1 --port 4096
```

This starts OpenCode on your **local machine** at `http://127.0.0.1:4096`

---

## 🎯 Step 3: Run Everything

### Option A: Use the Dev Script (Easiest)

```bash
cd ai-command-center
chmod +x scripts/dev-local.sh
./scripts/dev-local.sh
```

This script:
1. ✅ Checks if OpenCode is installed
2. ✅ Starts OpenCode server automatically
3. ✅ Starts Next.js dev server
4. ✅ Sets all environment variables

### Option B: Manual (Two Terminals)

**Terminal 1 - OpenCode:**
```bash
opencode serve --hostname 127.0.0.1 --port 4096
```

**Terminal 2 - Next.js:**
```bash
cd ai-command-center
npm run dev
```

---

## 📋 Summary

| Tool | Purpose | Where It Runs | Status |
|------|---------|---------------|--------|
| **Coolify** | Server deployment | On your server | ✅ Token configured |
| **OpenCode** | AI coding agent | On your local machine | ⚠️ Need to install |

---

## 🔍 Check Your Setup

### 1. Verify Coolify Token:
```bash
# Test Coolify API (replace URL if needed)
curl -H "Authorization: Bearer 2|q8BSUhiV3jZ7PdEejsojFn5JezYwWEZCUKC9Ev3V8a9b9e98" \
     https://coolify.th3ark.com/api/healthcheck
```

### 2. Verify OpenCode:
```bash
# Check if installed
opencode --version

# Test server (after starting)
curl http://127.0.0.1:4096/config
```

### 3. Start Everything:
```bash
./scripts/dev-local.sh
```

Then visit: `http://localhost:3000`

---

## 🆘 Troubleshooting

### "OpenCode not found"
- Install it: `npm install -g @opencode-ai/cli`
- Or: `curl -fsSL https://opencode.ai/install.sh | sh`

### "Coolify API error"
- Check `COOLIFY_API_URL` is correct in `.env.local`
- Verify token is correct
- Make sure Coolify is accessible

### "Port 4096 already in use"
- Kill existing OpenCode: `lsof -ti:4096 | xargs kill -9`
- Or use different port: `OPENCODE_SERVER_URL=http://127.0.0.1:4097`

---

**Ready to go!** Install OpenCode, then run `./scripts/dev-local.sh` 🚀

