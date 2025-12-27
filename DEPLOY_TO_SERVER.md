# 🚀 Deploy to Server (Coolify) - Step by Step

## Quick Summary

1. **Push code to GitHub** → Coolify watches your repo
2. **Set environment variables in Coolify** → API tokens, configs
3. **Deploy/Redeploy in Coolify** → Automatic build & deploy
4. **Done!** → Your app is live

---

## 📋 Step 1: Push Code to GitHub

### Check if you have a Git repository:

```bash
cd ai-command-center
git status
```

### If no Git repo, initialize one:

```bash
# Initialize git (if needed)
git init

# Add all files (except .env.local which is gitignored)
git add .

# Commit
git commit -m "Initial commit: AI Command Center with Coolify integration"
```

### Push to GitHub:

**Option A: If you already have a GitHub repo:**
```bash
# Add remote (if not already added)
git remote add origin https://github.com/ArkMaster123/coolify-opencode-command-center.git

# Push to main branch
git push -u origin main
```

**Option B: Create new GitHub repo:**
1. Go to https://github.com/new
2. Create repository: `coolify-opencode-command-center`
3. **Don't** initialize with README (you already have files)
4. Then run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/coolify-opencode-command-center.git
git branch -M main
git push -u origin main
```

---

## 🔧 Step 2: Set Up Coolify Service

### In Coolify Dashboard:

1. **Go to your Coolify instance**
   - URL: `https://coolify.th3ark.com` (or your Coolify URL)

2. **Create New Resource** (if first time):
   - Click **"New Resource"** → **"Application"**
   - Or go to existing service if you already have one

3. **Connect GitHub Repository:**
   - **Repository**: `https://github.com/ArkMaster123/coolify-opencode-command-center`
   - **Branch**: `main`
   - **Build Path**: **Leave EMPTY** (builds from root)
   - **Build Pack**: `nixpacks` (auto-detected)

4. **Configure Port:**
   - **Internal Port**: `3000`
   - Coolify will handle external port/domain

---

## 🔑 Step 3: Add Environment Variables in Coolify

**CRITICAL**: These must be set in Coolify dashboard, not in code!

### In Coolify Dashboard:

1. Go to your service → **Environment Variables** or **Settings**
2. Click **"Add Environment Variable"**
3. Add these **one by one**:

```env
# Coolify API (for server management)
COOLIFY_API_URL=https://coolify.th3ark.com
COOLIFY_API_TOKEN=2|q8BSUhiV3jZ7PdEejsojFn5JezYwWEZCUKC9Ev3V8a9b9e98

# OpenCode Configuration (Embedded Mode)
OPENCODE_MODE=embedded
OPENCODE_PORT=4097
DEFAULT_MODEL=opencode/grok-code

# Next.js Configuration
NODE_ENV=production
PORT=3000
NIXPACKS_NODE_VERSION=22
```

**Important Notes:**
- ✅ Use `OPENCODE_MODE` (not `OPEN_CODE_MODE`)
- ✅ Use `OPENCODE_PORT` (not `OPEN_CODE_PORT`)
- ✅ Model is `opencode/grok-code` (not `grok-code-fast-1`)
- ✅ `COOLIFY_API_TOKEN` is your token from earlier

---

## 🚀 Step 4: Deploy

### Option A: Automatic (if GitHub webhook is set up)
- Just push to GitHub: `git push origin main`
- Coolify will automatically detect and deploy

### Option B: Manual Deploy
1. In Coolify dashboard → Your service
2. Click **"Redeploy"** or **"Deploy"**
3. Watch the build logs
4. Wait for "Deployment successful"

---

## ✅ Step 5: Verify Deployment

### Check Health:
```bash
# Replace with your actual domain
curl https://your-domain.com/api/health
# Should return: {"status":"ok"}
```

### Check Status:
```bash
curl https://your-domain.com/api/status
# Should show connected: true
```

### Test in Browser:
- Go to your Coolify-assigned domain
- Should see the chat interface
- Check for "Connected" badges (green)

---

## 🔍 Troubleshooting

### Build Fails:
- Check build logs in Coolify
- Look for TypeScript/ESLint errors
- Verify all dependencies in `package.json`

### 404 Page Not Found:
- Check **Build Path** is empty (not `ai-command-center`)
- Verify `PORT=3000` is set
- Check runtime logs for startup errors

### OpenCode Not Connecting:
- Verify `OPENCODE_MODE=embedded` (not `client`)
- Check `OPENCODE_PORT=4097` is set
- Look for embedded server startup in logs

### Coolify API Not Working:
- Verify `COOLIFY_API_URL` is correct
- Check `COOLIFY_API_TOKEN` is valid
- Test API directly: `curl -H "Authorization: Bearer YOUR_TOKEN" https://coolify.th3ark.com/api/healthcheck`

---

## 📝 Quick Command Reference

```bash
# 1. Commit and push
cd ai-command-center
git add .
git commit -m "Deploy to Coolify"
git push origin main

# 2. Then in Coolify:
# - Go to service → Redeploy
# - Or wait for auto-deploy (if webhook configured)

# 3. Check deployment
curl https://your-domain.com/api/health
```

---

## 🎯 What Happens During Deployment

1. **Coolify detects push** to GitHub
2. **Pulls code** from repository
3. **Runs build**: `npm ci && npm run build`
4. **Starts app**: `npm start` (on port 3000)
5. **OpenCode starts embedded** (on port 4097)
6. **App is live** at your domain

---

## 🔄 Updating After Changes

After making code changes:

```bash
# 1. Commit changes
git add .
git commit -m "Your change description"
git push origin main

# 2. In Coolify: Click "Redeploy"
# Or wait for auto-deploy
```

---

## 📚 Reference

- **Coolify Docs**: https://coolify.io/docs
- **Deployment Guide**: `DEPLOYMENT.md`
- **Environment Variables**: `COOLIFY_API_SETUP.md`

---

**Ready to deploy?** Push to GitHub, set env vars in Coolify, and hit deploy! 🚀

