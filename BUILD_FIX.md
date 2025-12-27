# 🔧 Build Fix - Deployment Error

## Problem

Build failed with these errors:
1. ❌ `Cannot find module '@tailwindcss/postcss'` 
2. ❌ `Module not found: Can't resolve '@/components/ui/button'`
3. ❌ `Module not found: Can't resolve '@/lib/opencode'`

## Root Causes

### 1. Missing Build Dependency ✅ FIXED
- `@tailwindcss/postcss` was in `devDependencies` but needed for production build
- **Fixed**: Moved to `dependencies` in `package.json`

### 2. Base Directory Wrong ⚠️ NEEDS FIX IN COOLIFY
- Base Directory is set to `/ai-command-center` 
- **Should be**: **EMPTY** (the Next.js app is at the repo root)

## ✅ What I Fixed

1. ✅ Moved `@tailwindcss/postcss` from `devDependencies` → `dependencies`
2. ✅ Moved `tailwindcss` from `devDependencies` → `dependencies`
3. ✅ Committed changes to git

## 🔧 What You Need to Fix in Coolify

### Step 1: Fix Base Directory

1. Go to your Coolify service
2. Click **"Configuration"** or **"Settings"**
3. Find **"Base Directory"** field
4. **Clear it** - make it empty/blank
5. **Save** the configuration

### Step 2: Redeploy

1. Click **"Redeploy"** in Coolify
2. Watch the build logs
3. Should build successfully now!

## 📋 Environment Variables (Verify These Are Set)

Make sure these are set in Coolify → Environment Variables:

```env
COOLIFY_API_URL=https://coolify.th3ark.com
COOLIFY_API_TOKEN=2|q8BSUhiV3jZ7PdEejsojFn5JezYwWEZCUKC9Ev3V8a9b9e98
OPENCODE_MODE=embedded
OPENCODE_PORT=4097
DEFAULT_MODEL=opencode/grok-code
NODE_ENV=production
PORT=3000
NIXPACKS_NODE_VERSION=22
```

## 🚀 Next Steps

1. **Push the fix to GitHub:**
   ```bash
   cd ai-command-center
   git push origin main
   ```

2. **In Coolify:**
   - Clear Base Directory (set to empty)
   - Click "Redeploy"

3. **Monitor build logs** - should succeed now!

---

**The fix is committed locally. Just push and update Base Directory in Coolify!** 🚀

