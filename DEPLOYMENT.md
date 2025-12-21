# 🚀 Deployment Guide for Coolify

## ✅ Pre-Deployment Checklist

### 0. Repository Structure (VERIFY FIRST!)

**IMPORTANT**: Make sure Coolify is building from the **repository root**, not a subdirectory.

- ✅ Repository: `https://github.com/ArkMaster123/coolify-opencode-command-center`
- ✅ Branch: `main`
- ✅ Build Path: **Leave empty** (builds from root)
- ✅ The `package.json` should be at the root of the repo

If you see a 404, check:
1. Coolify → Service → Configuration → **Build Path** should be empty (not `ai-command-center`)
2. The repository root should have `package.json`, `next.config.ts`, etc.

### 1. Environment Variables (CRITICAL!)

In Coolify service settings, add these **exact** environment variables:

```bash
# OpenCode Configuration (REQUIRED)
OPENCODE_MODE=embedded
OPENCODE_PORT=4097
OPENCODE_SERVER_URL=http://142.132.171.59:4096

# Model Configuration
DEFAULT_MODEL=opencode/grok-code

# Next.js Configuration (REQUIRED)
NODE_ENV=production
PORT=3000

# Nixpacks Configuration
NIXPACKS_NODE_VERSION=22
```

**⚠️ IMPORTANT:**
- Use `OPENCODE_MODE` (not `OPEN_CODE_MODE`)
- Use `OPENCODE_SERVER_URL` (not `OPEN_CODE_SERVER_URL`)
- Model name is `grok-code` (not `grok-code-fast-1`)

### 2. Build Configuration

- **Build Pack**: Nixpacks (auto-detected)
- **Node Version**: 22 (via NIXPACKS_NODE_VERSION)
- **Build Command**: `npm run build` (automatic)
- **Start Command**: `npm start` (automatic)

### 3. Port Configuration

- **Internal Port**: `3000`
- **External Port**: Auto (Coolify handles this)

### 4. Domain Configuration

- Assign domain in Coolify
- Or use the SSLIP.io domain provided

## 🔍 Troubleshooting 404 Errors

If you get a 404 page not found:

1. **Check Build Logs:**
   - Go to Coolify → Your Service → Logs
   - Look for build errors or startup errors
   - Check if `npm run build` succeeded

2. **Check Runtime Logs:**
   - Look for "Ready on http://0.0.0.0:3000"
   - Check for any port binding errors
   - Verify PORT=3000 is set

3. **Verify Environment Variables:**
   - All variables must be set correctly
   - No typos in variable names
   - OPENCODE_MODE=embedded (not client)

4. **Check Next.js Output:**
   - Should see "standalone" output in build logs
   - Verify `.next/standalone` directory exists

5. **Test Health Endpoint:**
   ```bash
   curl http://your-domain/api/health
   ```
   Should return: `{"status":"ok"}`

## 🐛 Common Issues

### Issue: 404 Page Not Found
**Cause**: App not starting or wrong port
**Fix**: 
- Check PORT=3000 is set
- Verify start command: `npm start`
- Check logs for startup errors

### Issue: OpenCode Connection Failed
**Cause**: Wrong environment variables
**Fix**:
- Use `OPENCODE_MODE=embedded` (not `OPEN_CODE_MODE`)
- Set `OPENCODE_SERVER_URL` correctly
- Check embedded mode starts on port 4097

### Issue: Build Fails
**Cause**: TypeScript/ESLint errors
**Fix**:
- Check build logs for specific errors
- Ensure all dependencies are installed
- Verify Next.js version compatibility

## 📝 Deployment Steps

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **In Coolify:**
   - Go to your service
   - Click "Redeploy"
   - Monitor build logs

3. **Verify Deployment:**
   - Check `/api/health` endpoint
   - Check `/api/status` endpoint
   - Test chat functionality

## 🔗 Quick Links

- **Health Check**: `http://your-domain/api/health`
- **Status Check**: `http://your-domain/api/status`
- **Main App**: `http://your-domain/`

## 📊 Expected Behavior

After successful deployment:
- ✅ Health endpoint returns `{"status":"ok"}`
- ✅ Status endpoint shows `connected: true`
- ✅ Chat interface shows "Connected" badge
- ✅ Can send messages and get AI responses
- ✅ Reasoning dropdown works

