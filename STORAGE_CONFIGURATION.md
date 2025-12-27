# 💾 Storage Configuration Guide

## What to Do in Coolify Storage Settings

### Step 1: Click "Volume Mount" (Currently Selected)

You're seeing the storage options. **Click "Volume Mount"** - it's the purple highlighted option.

### Step 2: Configure the Volume Mount

Fill in these fields:

**Name:**
```
ai-command-center-data
```

**Host Path (Source):**
```
/mnt/HC_Volume_104047492/ai-command-center/data
```
This is the external 30GB volume we set up earlier.

**Container Path (Destination):**
```
/app/data
```
This is where the app will store data inside the container.

**Description (Optional):**
```
Persistent storage for AI Command Center - uses external 30GB volume
```

### Step 3: Save

Click "Save" or "Add" to create the volume mount.

## Why This Matters

✅ **Prevents Data Loss**: Data persists between deployments  
✅ **Uses External Storage**: Uses your 30GB volume, not root disk  
✅ **Prevents Disk Filling**: Build artifacts and data go to external storage  
✅ **Better Performance**: Dedicated storage for application data  

## What Gets Stored

The `/app/data` folder in the container will be mapped to `/mnt/HC_Volume_104047492/ai-command-center/data` on the host, so:

- OpenCode sessions
- Application logs
- User data
- Any persistent files

All stored on your external 30GB volume! 🚀

---

**Action**: Click "Volume Mount" and configure as above!

