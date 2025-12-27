# 🔧 Fix: 404 Page Not Found - Start Command Issue

## Problem

The container is running `next-server` (dev server) instead of the production standalone server, causing:
- ❌ 404 errors on all routes
- ❌ Port 3000 not listening properly
- ❌ Application not serving pages

## Root Cause

Coolify is using the wrong start command. It's running `next-server` instead of:
```bash
node .next/standalone/server.js
```

## ✅ Fix in Coolify Dashboard

### Step 1: Go to Application Settings
1. Open your application in Coolify
2. Click **"Configuration"** → **"General"** (or **"Advanced"**)

### Step 2: Find "Start Command" or "Command"
Look for a field labeled:
- **"Start Command"**
- **"Command"**
- **"Run Command"**
- **"Docker Command"**

### Step 3: Set the Correct Command
**Current (WRONG):**
```
next-server
```
or
```
next dev
```

**Should be (CORRECT):**
```bash
node .next/standalone/server.js
```

Or if using npm:
```bash
npm start
```

### Step 4: Save and Redeploy
1. **Save** the configuration
2. Click **"Deploy"** to rebuild with the correct command

## Alternative: Check Dockerfile

If there's a Dockerfile, make sure it has:
```dockerfile
CMD ["node", ".next/standalone/server.js"]
```

Or:
```dockerfile
CMD ["npm", "start"]
```

## Verification

After redeploy, check:
- ✅ Container logs show: `Ready in Xms` (Next.js standalone)
- ✅ Port 3000 is listening
- ✅ Routes work: `/`, `/api/health`, etc.

---

**Action Required**: Update the start command in Coolify to `node .next/standalone/server.js`

