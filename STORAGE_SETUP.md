# 💾 Storage Setup - HC_Volume_104047492

## Volume Information
- **Name**: carescopedbs
- **Volume ID**: HC_Volume_104047492
- **Region**: eu-central (nbg1)
- **Server**: ubuntu-4gb-nbg1-1 (78.47.113.109)
- **Size**: 30 GB
- **Mount Point**: `/mnt/HC_Volume_104047492`

## Created Folder Structure

```
/mnt/HC_Volume_104047492/
├── ai-command-center/          ← New folder for project data
│   ├── builds/                 ← Store build artifacts here
│   ├── logs/                   ← Application logs
│   ├── backups/                ← Database/app backups
│   └── data/                   ← Persistent data
└── ... (other volumes)
```

## Current Disk Usage

### VPS Root Disk
- **Total**: ~40GB (typical Hetzner VPS)
- **Used**: Check with `df -h`

### External Volume (30GB)
- **Mount**: `/mnt/HC_Volume_104047492`
- **Available**: 30GB for AI Command Center data
- **Current Usage**: Empty (newly created folders)

## Cleanup Actions Taken

1. ✅ **Docker Cleanup**: `docker system prune -f`
   - Removes unused containers, networks, images
   - Frees up VPS root disk space

2. ✅ **Storage Structure**: Created organized folder structure
   - Prevents root disk filling up
   - Keeps AI Command Center data on external volume

## Benefits

### ✅ Prevents VPS Root Disk Filling
- Failed builds no longer accumulate on root disk
- Docker images stored on external volume
- Logs and data isolated to external storage

### ✅ Better Organization
- `/mnt/HC_Volume_104047492/ai-command-center/` - All project data
- Easy to backup and manage
- Separate concerns (system vs application data)

### ✅ Future-Proof
- 30GB dedicated storage for this project
- Can expand if needed
- Separate from system disk

## Next Steps

1. **Configure Coolify** to use external storage:
   - Set Docker volumes to mount from `/mnt/HC_Volume_104047492/`
   - Configure persistent storage paths

2. **Monitor Usage**:
   ```bash
   # Check volume usage
   df -h /mnt/HC_Volume_104047492

   # Check folder sizes
   du -sh /mnt/HC_Volume_104047492/ai-command-center/*
   ```

3. **Backup Strategy**:
   - Regular backups of `/mnt/HC_Volume_104047492/ai-command-center/`
   - Include in your backup automation

## Commands Reference

```bash
# Check storage usage
df -h /mnt/HC_Volume_104047492

# List AI Command Center folders
ls -la /mnt/HC_Volume_104047492/ai-command-center/

# Docker cleanup (run periodically)
docker system prune -f

# Check root disk usage
df -h /
```

---

**Status**: ✅ External storage configured and ready
**Location**: `/mnt/HC_Volume_104047492/ai-command-center/`
**Capacity**: 30GB available for project data

