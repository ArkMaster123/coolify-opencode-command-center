# 🔍 Coolify Build Path Configuration

## ✅ Current Setup

The GitHub repository `ark-master123/coolify-opencode-command-center` has the Next.js app **at the root level**.

**Repository Structure:**
```
coolify-opencode-command-center/
├── package.json          ← Root level
├── next.config.ts        ← Root level
├── src/
├── public/
└── ...
```

## ⚠️ Coolify Configuration

In Coolify service settings, check:

1. **Repository**: `https://github.com/ArkMaster123/coolify-opencode-command-center`
2. **Branch**: `main`
3. **Base Directory**: **MUST BE EMPTY** (should be blank/empty)
   - ❌ WRONG: `/ai-command-center` ← This causes 404!
   - ✅ CORRECT: (empty/blank) or `/`
   
**CRITICAL**: If "Base Directory" is set to `/ai-command-center`, **clear it** and save!

## 🔍 How to Verify

1. Go to Coolify → Your Service → Configuration
2. Scroll to "Build Settings" or "Repository Settings"
3. Look for "Build Path" or "Root Directory"
4. It should be **empty/blank**
5. If it says `ai-command-center`, **clear it** and save

## 🐛 If Build Path is Wrong

If Coolify is looking in the wrong directory:

1. **Clear the Build Path** field (make it empty)
2. **Redeploy** the service
3. Check build logs - should see:
   ```
   Found application type: node
   Running: npm ci
   Running: npm run build
   ```

## ✅ Verification Checklist

After deployment, verify:
- [ ] Build logs show "Found application type: node"
- [ ] Build logs show "npm ci" running
- [ ] Build logs show "npm run build" running
- [ ] No errors about missing package.json
- [ ] App starts on port 3000
- [ ] `/api/health` returns `{"status":"ok"}`

