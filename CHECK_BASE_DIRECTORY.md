# ✅ Check Base Directory in Coolify Dashboard

## Confirmed Repository Structure

Your GitHub repo (`coolify-opencode-command-center`) has:
- ✅ `package.json` at **root**
- ✅ `next.config.ts` at **root**
- ✅ `src/` directory at **root**

**Therefore**: Base Directory should be **EMPTY** (blank)

## Where to Find Base Directory in Coolify

### Option 1: General Tab (Advanced Section)
1. Go to your application in Coolify
2. Click **"Configuration"** → **"General"**
3. Scroll down to **"Advanced"** section
4. Look for **"Base Directory"** or **"Build Path"** field
5. **It should be EMPTY/BLANK** ✅

### Option 2: Git Source Tab
1. Click **"Configuration"** → **"Git Source"**
2. Look for **"Base Directory"** or **"Build Path"** field
3. **It should be EMPTY/BLANK** ✅

## What You Should See

### ✅ CORRECT:
```
Base Directory: [empty/blank]
```
or
```
Base Directory: 
```

### ❌ WRONG:
```
Base Directory: /ai-command-center
```
or
```
Base Directory: /
```

## If Base Directory is NOT Empty

1. **Clear the field** - delete any value
2. **Leave it blank/empty**
3. Click **"Save"**
4. Click **"Deploy"** to trigger a new build

## Verification

After setting Base Directory to empty:
- ✅ Build should find `package.json` at repo root
- ✅ Build should find `src/` at repo root
- ✅ All path mappings (`@/*`) will work
- ✅ No more "Cannot find module" errors

---

**Current Status**: Base Directory should be **EMPTY** in Coolify UI
**Action**: Check the "General" → "Advanced" section or "Git Source" tab

